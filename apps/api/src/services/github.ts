import axios from "axios";
import { IUserRepository } from "../repository/user.repository";
import { User } from "../models/user.model";

export interface GithubRepositoryDTO {
    id: number;
    name: string;
    url: string;
}

export interface IGithubService {
    authenticateUser: (code:string) => Promise<User>;
    fetchAllRepositories: (user:User) => Promise<GithubRepositoryDTO[]>;
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
        const repositories = await axios.get(`${user.repositoryOutlink}?sort=updated`);
        return repositories.data.map((repo) => ({
            id: repo.id,
            name: repo.name,
            url: repo.url
        }))
    }

    return {
        authenticateUser,
        fetchAllRepositories
    }
}
