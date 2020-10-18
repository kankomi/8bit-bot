/* eslint-disable max-classes-per-file */
import { Model, ModelAttributes, InitOptions, DataTypes } from 'sequelize'

class Dummy extends Model {}

export default abstract class UserModel extends Dummy {
  userId!: string
  guildId!: string

  static init(
    attributes: ModelAttributes<Model<{}, {}>, {}>,
    options: InitOptions<Model<{}, {}>>
  ): Model<any, any> {
    return super.init(
      {
        userId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        guildId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        ...attributes,
      },
      options
    )
  }
}
