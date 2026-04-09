import { DataTypes, Model, Sequelize } from 'sequelize'

export class Edge extends Model {
    public id!: number
    public fromStepId!: number
    public toStepId!: number
}

export type EdgeType = typeof Edge;

export function initEdgeModel(sequelize: Sequelize) {
    Edge.init(
        {
            fromStepId: DataTypes.INTEGER,
            toStepId: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'dependency',
            createdAt: true,
            updatedAt: true
        }
    )

    return Edge;
}
