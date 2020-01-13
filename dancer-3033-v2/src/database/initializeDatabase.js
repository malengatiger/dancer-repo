import definedSequelizeDb from './define-sequelize-db';
import LocationModel from './LocationModel';
/**
 * Init / create location table
 */
export default async function initializeDatabase () {
  try {
    mlog(`🔵🔵 initializing database for background location ...`)
    await definedSequelizeDb.authenticate();
    mlog(`🔵🔵 database for background location initialized 🍎`)
  } catch (err) {
    console.log('Unable to connect to the database:', err);
  }
  try {
    await LocationModel.sync({ alter: true });
    mlog(`🔵🔵 LocationModel.sync executed with alter: true 🍎🍎🍎🍎`)
  } catch (err) {
    console.log('Unable to sync database:', err);
  }
}
