import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Artist from './artist.model';
import Album from './album.model';

class Track extends Model {
	public id!: string;
	public name!: string;
	public duration!: number;
	public hidden!: boolean;
	public artist_id!: string;
	public album_id!: string;
	public created_at!: Date;
	public updated_at!: Date;
	public artist!: Artist;
	public album!: Album;
}

Track.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			field: 'track_id',
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		duration: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1,
			},
		},
		hidden: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		artist_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'artists',
				key: 'artist_id',
			},
		},
		album_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'albums',
				key: 'album_id',
			},
		},
	},
	{
		sequelize,
		modelName: 'Track',
		tableName: 'tracks',
		timestamps: true,
		underscored: true,
	}
);

export default Track;
