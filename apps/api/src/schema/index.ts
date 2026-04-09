import { Sequelize } from "sequelize";
import { initUserModel, UserType } from "./user.schema";
import { initPullRequestModel, PullRequestType } from "./pullRequest.schema";
import { FileType, initFileModel } from "./file.schema";
import { initStepModel, StepType } from "./step.schema";
import { EdgeType, initEdgeModel } from "./edge.schema";

export interface CommitScriptSchema {
    User: UserType;
    PullRequest: PullRequestType;
    File: FileType;
    Step: StepType;
    Edge: EdgeType;
}

export function generateSchema(sequelize: Sequelize): CommitScriptSchema {
    const UserModel = initUserModel(sequelize);
    const PullRequestModel = initPullRequestModel(sequelize);
    const FileModel = initFileModel(sequelize);
    const StepModel = initStepModel(sequelize);
    const EdgeModel = initEdgeModel(sequelize);

    PullRequestModel.hasMany(FileModel)
    FileModel.belongsTo(PullRequestModel)

    FileModel.hasMany(StepModel)
    StepModel.belongsTo(FileModel)

    StepModel.belongsToMany(StepModel, {
        through: EdgeModel,
        as: 'DependsOn',
        foreignKey: 'fromStepId'
    })

    return {
        User: UserModel,
        PullRequest: PullRequestModel,
        File: FileModel,
        Step: StepModel,
        Edge: EdgeModel
    }
}
