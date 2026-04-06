import { RepositoriesModule } from "../repository/types.repository";
import { AuthenticationService } from "./authentication.service";
import { GithubService } from "./github.service";
import { ServicesModule } from "./types.services";

export default function registerServices(repositories: RepositoriesModule): ServicesModule {
   
    const authenticationService = AuthenticationService(repositories.UserRepository);
    const githubService = GithubService();

    return {
        AuthenticationService: authenticationService,
        GithubService: githubService
    }

}
