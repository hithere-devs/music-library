import { Sequelize } from 'sequelize';

// config
import config from '.';

/**
 * Initializes a new Sequelize instance with the provided configuration.
 *
 * @constant
 * @type {Sequelize}
 * @property {string} dialect - The database dialect to be used (e.g., 'postgres', 'mysql').
 * @property {string} host - The hostname of the database server.
 * @property {number} port - The port number on which the database server is running.
 * @property {string} database - The name of the database to connect to.
 * @property {string} username - The username for database authentication.
 * @property {string} password - The password for database authentication.
 * @property {object} dialectOptions - Additional options for the database dialect.
 * @property {object} dialectOptions.ssl - SSL configuration for the database connection.
 * @property {boolean} dialectOptions.ssl.require - Whether SSL is required for the connection.
 * @property {boolean} dialectOptions.ssl.rejectUnauthorized - Whether to reject unauthorized SSL certificates.
 * @property {boolean} logging - Whether to enable logging of SQL queries.
 */
const sequelize = new Sequelize({
	dialect: config.db.dialect,
	host: config.db.host,
	port: config.db.port,
	database: config.db.database,
	username: config.db.username,
	password: config.db.password,
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	},
	logging: false,
});

export default sequelize;
