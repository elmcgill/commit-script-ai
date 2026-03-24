import { User, UserType } from "../schema/user.schema";
import { CreateUserDTO } from "./dto/CreateUserDTO";
import { IUserRepository } from "./types.repository";

export default function UserRepository(model: UserType): IUserRepository {

    const create = async (data:CreateUserDTO) => {
        return await model.create({
            token: data.token,
            username: data.username,
            fullName: data.fullName,
            avatar: data.avatar,
            repositoryOutlink: data.repositoryOutlink
        });
    }

    const readById = async (id:string): Promise<User> => {
        const user = await model.findByPk(id);
        return user?.get();
    }

    return {
        create,
        readById
    }
}
