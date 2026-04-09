import { RepositoriesModule } from "../repository/types.repository";
import { AuthenticationService } from "./authentication.service";
import { CodeService } from "./code.service";
import { GithubService } from "./github.service";
import { OllamaService } from "./ollama.service";
import { ServicesModule } from "./types.services";
import WalkthroughService from "./walkthrough.service";

export default function registerServices(repositories: RepositoriesModule): ServicesModule {
   
    const authenticationService = AuthenticationService(repositories.UserRepository);
    const githubService = GithubService();
    const codeService = CodeService(githubService);
    const ollamaService = OllamaService();
    const walkthroughService = WalkthroughService(codeService);

    return {
        AuthenticationService: authenticationService,
        GithubService: githubService,
        CodeService: codeService,
        OllamaService: ollamaService,
        WalkthroughService: walkthroughService
    }

}
