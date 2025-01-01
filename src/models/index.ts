import User from './user.model';
import Artist from './artist.model';
import Album from './album.model';
import Track from './track.model';
import Favorite from './favorite.model';
import sequelize from '../config/database';
import { Sequelize } from 'sequelize';

const db: { [key: string]: any } = {};

// Initialize models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Add models
db.User = User;
db.Artist = Artist;
db.Album = Album;
db.Track = Track;
db.Favorite = Favorite;

// Define associations
Artist.hasMany(Album);
Album.belongsTo(Artist);

Artist.hasMany(Track);
Track.belongsTo(Artist);

Album.hasMany(Track);
Track.belongsTo(Album);

User.hasMany(Favorite);
Favorite.belongsTo(User);

const syncModels = async () => {
	try {
		await sequelize.authenticate();
		// Be careful with this in production
		await User.sync({ alter: true });
		await Artist.sync({ alter: true });
		await Album.sync({ alter: true });
		await Track.sync({ alter: true });
		await Favorite.sync({ alter: true });

		console.log('Database connection established.');
		console.log('All models were synchronized successfully.');
	} catch (error) {
		console.error('Error synchronizing models:', error);
		throw error;
	}
};

db.syncModels = syncModels;

export default db;
