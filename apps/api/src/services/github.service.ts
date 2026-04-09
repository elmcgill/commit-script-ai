import axios from "axios";
import { User } from "../schema/user.schema";
import { IGithubService } from "./types.services";
import { GithubOrganizationResponseDTO, GithubPullRequestDTO, GithubPullRequestFileContent, GithubPullRequestResponseDTO, GithubRepositoryDTO, GithubRepositoryFileContentResponseDTO, GithubRepositoryResponseDTO } from "../types/github.types";


export function GithubService(): IGithubService {

    const fetchUsersOrganizations = async (user: User): Promise<GithubOrganizationResponseDTO[]> => {
        const res = await axios.get(`https://api.github.com/user/orgs`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        return res.data;
    }

    const fetchUsersOrganizationRepositories = async (user: User): Promise<GithubRepositoryResponseDTO[]> => {
        const allOrganizations = await fetchUsersOrganizations(user);
        const promises = allOrganizations.map((org) => {
            return axios.get(org.repos_url, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
        });
        const resolvedRepos = await Promise.all(promises);

        return resolvedRepos.map(res => res.data).flatMap(repo => repo);
    }

    const fetchUsersRepositories = async (user: User): Promise<GithubRepositoryResponseDTO[]> => {
        const res = await axios.get(user.repositoryOutlink, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        return res.data;
    }

    const mapAndMergeUsersRepositories = (repositories: GithubRepositoryResponseDTO[]): GithubRepositoryDTO[] => {
        return repositories.sort((a, b) => {
            let dateA, dateB;
            if (a.updated_at) {
                dateA = new Date(a.updated_at).getTime();
            } else {
                dateA = new Date().getTime();
            }

            if (b.updated_at) {
                dateB = new Date(b.updated_at).getTime();
            } else {
                dateB = new Date().getTime();
            }
            return dateB - dateA;
        })
            .map((repo) => {
                return {
                    id: repo.id,
                    name: repo.name,
                    url: repo.url
                }
            })
    }


    const fetchAllUsersRespositories = async (user: User): Promise<GithubRepositoryDTO[]> => {
        const [userOwnedRepos, orgRepos] = await Promise.all([fetchUsersRepositories(user), fetchUsersOrganizationRepositories(user)]);

        const repositories = mapAndMergeUsersRepositories([...userOwnedRepos, ...orgRepos]);

        return repositories;
    }

    const fetchRepositoryPullRequests = async (user: User, repository: GithubRepositoryDTO): Promise<GithubPullRequestDTO[]> => {
        const res = await axios.get(`${repository.url}/pulls?state=open`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const pullRequests: GithubPullRequestResponseDTO[] = res.data;

        return pullRequests.map((pr) => ({
            id: pr.id,
            title: pr.title,
            url: pr.url,
            headRef: pr.head.ref,
            number: pr.number
        }));

    }

    const fetchPullRequestDiff = async (user: User, pullRequest: GithubPullRequestDTO): Promise<string> => {
        const res = await axios.get(pullRequest.url, {
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Accept': 'application/vnd.github.v3.diff'
            }
        });
        return res.data as string;
    }

    const fetchPullRequestFileContents = async (user: User, pullRequest: GithubPullRequestDTO, fileCount: number): Promise<GithubPullRequestFileContent[]> => {
        const pages = Math.ceil(fileCount / 30);
        const fileRequests = [];
        for (let i = 1; i <= pages; i++) {
            fileRequests.push(
                axios.get(`${pullRequest.url}/files?page=${i}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
            )
        }
        const fileResponses = await Promise.all(fileRequests);
        const files = fileResponses.map(res => res.data).flatMap(file => file);
        
        const fileContentRequests = files.map((file) => {
            return axios.get(file.contents_url, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
        });
        
        const filesContentResponses = await Promise.all(fileContentRequests);
        const mappedFilesContent:GithubRepositoryFileContentResponseDTO[] = filesContentResponses.map(res => res.data);
        
        const filesContent:GithubPullRequestFileContent[] = mappedFilesContent.map((content) => {
            return {
                file: content.path,
                content: Buffer.from(content.content, 'base64').toString('utf-8') as string
            }
        })
        
        return filesContent;

    }

    return {
        fetchAllUsersRespositories,
        fetchRepositoryPullRequests,
        fetchPullRequestDiff,
        fetchPullRequestFileContents
    }

}
