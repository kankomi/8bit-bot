import { Sequelize } from 'sequelize';
import { initializeModels } from './models';

export async function initializeDb() {
  const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });

  await initializeModels(sequelize);
  await sequelize.sync();
}
