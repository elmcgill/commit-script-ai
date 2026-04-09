import { DataTypes, Model, Sequelize } from 'sequelize';

export class Step extends Model {
    public id!: number
    public fileId!: number
    public line!: number
    public code!: string
    public type!: string
    public symbol!: string | null
}

export type StepType = typeof Step;

export function initStepModel(sequelize: Sequelize) {
    Step.init(
        {
            fileId: DataTypes.INTEGER,
            line: DataTypes.INTEGER,
            code: DataTypes.TEXT,
            type: DataTypes.STRING, // type | component | logic | ui | import
            symbol: DataTypes.STRING // e.g. "BottomlessModal"
        },
        {
            sequelize,
            modelName: 'step',
            createdAt: true,
            updatedAt: true
        }
    )

    return Step;
}
