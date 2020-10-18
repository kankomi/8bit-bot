import { Sequelize, Model, DataTypes } from 'sequelize'

class ToeCounter extends Model {
  userId!: string
  count!: number
}

export function init(sequelize: Sequelize) {
  ToeCounter.init(
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      count: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    { sequelize }
  )
}

export default ToeCounter
