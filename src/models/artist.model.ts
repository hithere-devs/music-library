import { Model, DataTypes } from 'sequelize';

// config
import sequelize from '../config/database';

// models
import Album from './album.model';
import Track from './track.model';

class Artist extends Model {
	public id!: string;
	public name!: string;
	public grammy!: boolean;
	public hidden!: boolean;
	public created_at!: Date;
	public updated_at!: Date;
	public albums!: Album[];
	public tracks!: Track[];
}

Artist.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			field: 'artist_id',
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		grammy: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		hidden: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		sequelize,
		modelName: 'Artist',
		tableName: 'artists',
		timestamps: true,
		underscored: true,
	}
);

export default Artist;
