import { User } from "../schema/user.schema"
import { GithubRepositoryDTO } from "../types/github.types";

export interface IAuthenticationService {
    encodeUser: (user:User) => string;
    decodeUser: (token?:string) => Promise<User>;
    authenticate: (code: string) => Promise<User>;
    validate: (token?: string) => Promise<User>;
}

export interface IGithubService {
    fetchAllUsersRespositories: (user:User) => Promise<GithubRepositoryDTO[]>;
}

export interface ServicesModule {
    AuthenticationService: IAuthenticationService,
    GithubService: IGithubService
}
