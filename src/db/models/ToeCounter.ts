import { Sequelize, Model, DataTypes } from 'sequelize';

class ToeCounter extends Model {
  userId!: string;
  count!: string;
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
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    { sequelize }
  );
}

export default ToeCounter;
