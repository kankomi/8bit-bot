import { DataTypes, Sequelize } from 'sequelize';
import UserModel from './UserModel';
import { getLevelForExp, getExpForLevel } from '../../utils/experience';
import logger from '../../utils/logging';

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

  static async getOrCreateRanking(userId: string, guildId: string): Promise<Ranking | undefined> {
    let ranking = await Ranking.findOne({
      where: { userId, guildId },
    });

    if (!ranking) {
      ranking = await Ranking.create({
        userId,
        guildId,
      });

      if (ranking === null) {
        logger.error(`Could not create ranking for user ${userId} in guild ${guildId}`);
        return undefined;
      }
    }

    return ranking;
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
