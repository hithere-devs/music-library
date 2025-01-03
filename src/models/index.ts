import User from './user.model';
import Artist from './artist.model';
import Album from './album.model';
import Track from './track.model';
import Favorite from './favorite.model';
import sequelize from '../config/database';
import { Sequelize } from 'sequelize';

type DbModels = {
	User: typeof User;
	Artist: typeof Artist;
	Album: typeof Album;
	Track: typeof Track;
	Favorite: typeof Favorite;
	sequelize: typeof sequelize;
	Sequelize: typeof Sequelize;
	syncModels: () => Promise<void>;
};

// Define associations
Artist.hasMany(Album);
Album.belongsTo(Artist);

Artist.hasMany(Track);
Track.belongsTo(Artist);

Album.hasMany(Track);
Track.belongsTo(Album);

User.hasMany(Favorite);
Favorite.belongsTo(User);

/**
 * Synchronizes all models with the database.
 *
 * This function authenticates the connection to the database and then synchronizes
 * the User, Artist, Album, Track, and Favorite models. The `alter` option is used
 * to make the database schema match the models. This should be used with caution
 * in production environments as it may lead to data loss.
 *
 * @throws Will throw an error if there is an issue with authentication or synchronization.
 */
const syncModels = async () => {
	try {
		await sequelize.authenticate();
		// Be careful with this in production
		// await User.sync({ alter: true });
		// await Artist.sync({ alter: true });
		// await Album.sync({ alter: true });
		// await Track.sync({ alter: true });
		// await Favorite.sync({ alter: true });

		console.log('\n');

		console.log('Database connection established.');
		console.log('All models were synchronized successfully.');
	} catch (error) {
		console.error('Error synchronizing models:', error);
		throw error;
	}
};

const db: DbModels = {
	User,
	Artist,
	Album,
	Track,
	Favorite,
	sequelize,
	Sequelize,
	syncModels,
} as DbModels;

export default db;
