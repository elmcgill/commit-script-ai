import { User } from "../schema/user.schema"
import { StepNode } from "../types/code.types";
import { GithubPullRequestDTO, GithubPullRequestFileContent, GithubRepositoryDTO } from "../types/github.types";

export interface IAuthenticationService {
    encodeUser: (user: User) => string;
    decodeUser: (token?: string) => Promise<User>;
    authenticate: (code: string) => Promise<User>;
    validate: (token?: string) => Promise<User>;
}

export interface IGithubService {
    fetchAllUsersRespositories: (user: User) => Promise<GithubRepositoryDTO[]>;
    fetchRepositoryPullRequests: (user: User, repository: GithubRepositoryDTO) => Promise<GithubPullRequestDTO[]>;
    fetchPullRequestDiff: (user: User, pullRequest: GithubPullRequestDTO) => Promise<string>;
    fetchPullRequestFileContents: (user:User, pullRequest:GithubPullRequestDTO, fileCount: number) => Promise<GithubPullRequestFileContent[]>
}

export interface ICodeService {
    processGitDiff: (user: User, pullRequest: GithubPullRequestDTO) => Promise<StepNode[]>;
}

export interface IOllamaService {
    askOllama: (prompt: string, model: string) => Promise<string>
}

export interface IWalkthroughService {
    generateWalkthroughEpisodes: (user:User, pullRequest: GithubPullRequestDTO) => Promise<StepNode[]>;
}

export interface ServicesModule {
    AuthenticationService: IAuthenticationService,
    GithubService: IGithubService,
    CodeService: ICodeService,
    OllamaService: IOllamaService,
    WalkthroughService: IWalkthroughService
}
