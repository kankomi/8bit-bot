import fs from 'fs';
import { Sequelize } from 'sequelize';

export async function initializeModels(sequelize: Sequelize) {
  for (const file of fs.readdirSync(__dirname)) {
    if (file === 'index.ts') continue;

    const loader = await import('./' + file);
    if (loader.init !== undefined) {
      loader.init(sequelize);
    }
  }

  await sequelize.sync();
}
