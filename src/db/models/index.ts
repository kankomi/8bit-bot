import fs from 'fs'
import { Sequelize } from 'sequelize'

// eslint-disable-next-line import/prefer-default-export
export async function initializeModels(sequelize: Sequelize) {
  for (const file of fs.readdirSync(__dirname)) {
    if (file !== 'index.ts') {
      const loader = await import(`./${file}`)
      if (loader.init !== undefined) {
        loader.init(sequelize)
      }
    }
  }

  await sequelize.sync()
}
