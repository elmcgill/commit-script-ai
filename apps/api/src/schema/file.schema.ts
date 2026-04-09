import { DataTypes, Model, Sequelize } from 'sequelize'

export class File extends Model {
    public id!: number
    public path!: string
    public pullRequestId!: number
}

export type FileType = typeof File;

export function initFileModel(sequelize: Sequelize) {
    File.init(
        {
            path: DataTypes.STRING,
            pullRequestId: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'file',
            createdAt: true,
            updatedAt: true
        }
    )

    return File;
}
