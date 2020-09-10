import { DataTypes, Sequelize } from 'sequelize';
import UserModel from './UserModel';
import { getLevelForExp, getExpForLevel } from '../../utils/experience';

class Ranking extends UserModel {
  experience!: number;
  level!: number;

  addExperience(val: number) {
    this.experience += val;
    this.level = getLevelForExp(this.experience);
  }

  removeExperience(val: number) {
    this.experience -= val;
    this.level = getLevelForExp(this.experience);
  }

  setExperience(val: number) {
    this.experience = val;
    this.level = getLevelForExp(this.experience);
  }

  setLevel(val: number) {
    this.level = val;
    this.experience = getExpForLevel(val);
  }
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
        defaultValue: 1,
      },
    },
    { sequelize }
  );
}

export default Ranking;
