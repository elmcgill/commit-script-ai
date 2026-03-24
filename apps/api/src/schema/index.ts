import { Sequelize } from "sequelize";
import { initUserModel, UserType } from "./user.schema";

export interface CommitScriptSchema {
    User: UserType;
}

export function generateSchema(sequelize:Sequelize): CommitScriptSchema {
    const UserModel = initUserModel(sequelize);

    return {
        User: UserModel
    }
}
