import { DataTypes, Model, Sequelize } from "sequelize";

export class User extends Model {
    declare id: string;
    declare token: string;
    declare username: string;
    declare fullName: string;
    declare avatar: string;
    declare repositoryOutlink: string;
}

export type UserType = typeof User;

export function initUserModel(sequelize: Sequelize) {
    User.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            token: {
                type: DataTypes.STRING,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            fullName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: true
            },
            repositoryOutlink: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: "User",
            createdAt: true,
            updatedAt: true
        }
    )

    return User;
}
