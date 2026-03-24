import { User, UserType } from "../schema/user.schema";
import { CreateUserDTO } from "./dto/CreateUserDTO";

export interface IUserRepository {
    create: (data:CreateUserDTO) => Promise<User>
}

export const UserRepository = (model: UserType): IUserRepository => {
    const create = async (data:CreateUserDTO) => {
        return await model.create({
            token: data.token,
            username: data.username,
            fullName: data.fullName,
            avatar: data.avatar,
            repositoryOutlink: data.repositoryOutlink
        });
    }

    return {
        create
    }
}
