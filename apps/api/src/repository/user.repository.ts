import { User } from "../models/user.model";

interface CreateUserDTO {
    token: string;
    username: string;
    fullName: string;
    avatar: string;
    repositoryOutlink: string;
}

export interface IUserRepository {
    create: (data:CreateUserDTO) => Promise<User>
}

export const UserRepository = (model: typeof User): IUserRepository => {
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
