import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'commit_script.db',
    logging: false
});
