import { Sequelize } from 'sequelize';
import config from '.';

const sequelize = new Sequelize({
	dialect: config.db.dialect,
	host: config.db.host,
	port: config.db.port,
	database: config.db.database,
	username: config.db.username,
	password: config.db.password,
	logging: false,
});

export default sequelize;
