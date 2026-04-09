import { DataTypes, Model, Sequelize } from "sequelize";

export class PullRequest extends Model {
    public id!: number;
    public repository!: string;
    public prNumber!: number;
}

export type PullRequestType = typeof PullRequest;

export function initPullRequestModel(sequelize: Sequelize) {
    PullRequest.init(
        {
            repo: DataTypes.STRING,
            prNumber: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'pull_request',
            createdAt: true,
            updatedAt: true
        }
    )

    return PullRequest;
}
