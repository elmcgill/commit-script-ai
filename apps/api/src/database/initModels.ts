import { Sequelize } from "sequelize";
import { initUserModel, User } from "../models/user.model";

export interface DBModels {
    User: typeof User;
}

export function initModels(sequelize:Sequelize): DBModels {
    const UserModel = initUserModel(sequelize);

    return {
        User: UserModel
    }
}
