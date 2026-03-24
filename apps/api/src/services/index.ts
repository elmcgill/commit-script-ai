import { RepositoriesModule } from "../repository/types.repository";
import { AuthenticationService } from "./authentication.service";
import { ServicesModule } from "./types.services";

export default function registerServices(repositories: RepositoriesModule): ServicesModule {
   
    const authenticationService = AuthenticationService(repositories.UserRepository);

    return {
        AuthenticationService: authenticationService
    }

}
