import { User } from "../schema/user.schema";
import { CreateUserDTO } from "./dto/CreateUserDTO";

export interface IUserRepository {
    create: (data:CreateUserDTO) => Promise<User>;
    readById: (id:string) => Promise<User>;
}

export interface RepositoriesModule {
    UserRepository: IUserRepository;
}
