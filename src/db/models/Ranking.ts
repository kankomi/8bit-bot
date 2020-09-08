import { DataTypes, Sequelize } from 'sequelize';
import UserModel from './UserModel';

class Ranking extends UserModel {
  experience!: number;
  level!: number;
}

export function init(sequelize: Sequelize) {
  Ranking.init(
    {
      experience: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      level: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    { sequelize }
  );
}

export default Ranking;
