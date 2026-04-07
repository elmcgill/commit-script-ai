import axios from "axios";
import { User } from "../schema/user.schema";
import { IGithubService } from "./types.services";
import { GithubOrganizationResponseDTO, GithubPullRequestDTO, GithubPullRequestResponseDTO, GithubRepositoryDTO, GithubRepositoryResponseDTO } from "../types/github.types";


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

    const mapAndMergeUsersRepositories = (repositories:GithubRepositoryResponseDTO[]): GithubRepositoryDTO[] => {
        return repositories.sort((a, b) => {
                let dateA, dateB;
                if(a.updated_at){
                    dateA = new Date(a.updated_at).getTime();
                } else {
                    dateA = new Date().getTime();
                }

                if(b.updated_at){
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

    const fetchRepositoryPullRequests = async (user:User, repository:GithubRepositoryDTO): Promise<GithubPullRequestDTO[]> => {
        console.log(user, repository);
        const res = await axios.get(`${repository.url}/pulls?state=open`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const pullRequests:GithubPullRequestResponseDTO[] = res.data;

        return pullRequests.map((pr) => ({
            id: pr.id,
            title: pr.title,
            diffUrl: pr.diff_url,
            headRef: pr.head.ref,
            number: pr.number
        }));

    }

    return {
        fetchAllUsersRespositories,
        fetchRepositoryPullRequests
    }

}
