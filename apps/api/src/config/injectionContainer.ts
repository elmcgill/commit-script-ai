import { GithubController, IGithubController } from "../controllers/github.controller";
import { initModels } from "../database/initModels";
import { UserRepository } from "../repository/user.repository";
import { GithubService } from "../services/github";
import { sequelize } from "./database";

export interface IDependencyInjector {
    githubController: IGithubController;
}

export async function initDepedencyInjector(): Promise<IDependencyInjector>{
    await sequelize.authenticate();
    const models = initModels(sequelize);
    await sequelize.sync({force: true /* Just for testing */});

    /* Repositories */
    const userRepository = UserRepository(models.User);

    /* Services */
    const githubService = GithubService(userRepository);

    /* Controllers */
    const githubController = GithubController(githubService);

    return {
        githubController
    }
}
