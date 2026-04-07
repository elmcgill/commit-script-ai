import { User } from "../schema/user.schema"
import { GithubPullRequestDTO, GithubRepositoryDTO } from "../types/github.types";

export interface IAuthenticationService {
    encodeUser: (user:User) => string;
    decodeUser: (token?:string) => Promise<User>;
    authenticate: (code: string) => Promise<User>;
    validate: (token?: string) => Promise<User>;
}

export interface IGithubService {
    fetchAllUsersRespositories: (user:User) => Promise<GithubRepositoryDTO[]>;
    fetchRepositoryPullRequests: (user:User, repository: GithubRepositoryDTO) => Promise<GithubPullRequestDTO[]>
}

export interface ServicesModule {
    AuthenticationService: IAuthenticationService,
    GithubService: IGithubService
}
