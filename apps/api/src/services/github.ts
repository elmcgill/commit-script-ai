import axios from "axios";
import { IUserRepository } from "../repository/user.repository";
import { User } from "../models/user.model";


export interface GithubRepositoryDTO {
    id: number;
    name: string;
    url: string;
}

export interface GithubPullRequestDTO {
    id: number;
    title: string;
    diffUrl: string;
    headRef: string;
    number: number;
}

export interface FetchDiffAndFilesContentForLLMDTO {
    fileContent: string;
    diff: string;
}

type DiffFile = {
  oldPath: string;
  newPath: string;
  diff: string;
  fullContent: string;
};

export interface IGithubService {
    authenticateUser: (code:string) => Promise<User>;
    fetchAllRepositories: (user:User) => Promise<GithubRepositoryDTO[]>;
    fetchOpenPullRequests: (user:User, repository: string) => Promise<GithubPullRequestDTO[]>;
    fetchDiffAndFilesContentForLLM: (owner: User, repository:string, pr:GithubPullRequestDTO) => Promise<FetchDiffAndFilesContentForLLMDTO>
}

export function GithubService(userRepository: IUserRepository):IGithubService {
    const { create } = userRepository;

    async function authenticateUser(code: string) {
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.NODE_GITHUB_CLIENT_ID,
                client_secret: process.env.NODE_GITHUB_CLIENT_SECRET,
                code
            },
            {
                headers: { accept: 'application/json' }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get("https://api.github.com/user",
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const user = userResponse.data;
        const persistedUser = await create({
            token: accessToken,
            username: user.login,
            fullName: user.name,
            avatar: user.avatar_url,
            repositoryOutlink: user.repos_url
        });

        return persistedUser.dataValues;
    }

    const fetchAllRepositories = async (user:User) => {
        const repositories = await axios.get(`${user.repositoryOutlink}?sort=updated`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        return repositories.data.map((repo) => ({
            id: repo.id,
            name: repo.name,
            url: repo.url
        }))
    }

    const fetchOpenPullRequests = async (user:User, repository:string) => {
        const res = await axios.get(`https://api.github.com/repos/${user.username}/${repository}/pulls?state=open`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        return res.data.map((pr) => ({
            id: pr.id,
            title: pr.title,
            diffUrl: pr.diff_url,
            headRef: pr.head.ref,
            number: pr.number
        }))
    }

    const fetchPRFiles = async (owner:User, repository:string, pr:GithubPullRequestDTO) => {
        const res = await axios.get(`https://api.github.com/repos/${owner.username}/${repository}/pulls/${pr.number}/files`, {
            headers: {
                'Authorization': `Bearer ${owner.token}`
            }
        });

        return res.data;
    }

    const fetchPRFileContent = async (owner:User, files:Array<any>) => {
        const fileRequests = files.map((file) => {
            return axios.get(file.contents_url, {
                headers: {
                    'Authorization': `Bearer ${owner.token}`
                }
            })
        });

        const filePromises = await Promise.all(fileRequests);
        const fileContents = filePromises.map((file) => {
            return {
                filePath: file.data.path,
                content: Buffer.from(file.data.content, 'base64').toString('utf-8')
            }
        })
        
        return fileContents;
    }

    const fetchPRDiff = async (owner:User, pr:GithubPullRequestDTO) => {
        const res = await axios.get(pr.diffUrl, {
            headers: {
                'Authorization': `Bearer ${owner.token}`,
                'Accept': 'application/vnd.github.v3.diff'
            }
        })

        return res.data as string;
    }

    const fetchDiffAndFilesContentForLLM = async (owner: User, repository:string, pr:GithubPullRequestDTO) => {
        const [files, diff] = await Promise.all([
            fetchPRFiles(owner, repository, pr),
            fetchPRDiff(owner, pr)
        ]);
        
        const fileContent = await fetchPRFileContent(owner, files); 
        
        const diffFiles: DiffFile[] = [];
        const regex = /^diff --git a\/(.+?) b\/(.+)$/gm;
        let match;

        while ((match = regex.exec(diff)) !== null) {
            console.log(match[2]);
            diffFiles.push({
                oldPath: match[1],
                newPath: match[2],
                fullContent: fileContent.find((content) => content.filePath === match[2]) ?? '',
                diff: ""
            });
        }

        const diffParts = diff.split(/^diff --git /gm).filter(Boolean);

        const diffsMappedByFile = diffParts.map((part) => {
            const header = part.split("\n")[0];
            const match = header.match(/^a\/(.+?) b\/(.+)$/);
            const file = match ? match[2] : "unknown";

            return {
                file,
                diff: "diff --git " + part,
            };
        })

        const chunkedPR = diffFiles.map((info) => {
            return {
                ...info,
                diff: diffsMappedByFile.find((d) => d.file === info.newPath)?.diff ?? ''
            }
        });

        console.log(chunkedPR);

        return {
            fileContent: JSON.stringify(fileContent),
            diff
        }

    }

    return {
        authenticateUser,
        fetchAllRepositories,
        fetchOpenPullRequests,
        fetchDiffAndFilesContentForLLM
    }
}
