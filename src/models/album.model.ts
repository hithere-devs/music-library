import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Artist from './artist.model';
import Track from './track.model';

class Album extends Model {
	public id!: string;
	public name!: string;
	public year!: number;
	public hidden!: boolean;
	public artist_id!: string;
	public created_at!: Date;
	public updated_at!: Date;
	public artist!: Artist;
	public tracks!: Track[];
}

Album.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			field: 'album_id',
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1900,
				max: new Date().getFullYear(),
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
	},
	{
		sequelize,
		modelName: 'Album',
		tableName: 'albums',
		timestamps: true,
		underscored: true,
	}
);

export default Album;
