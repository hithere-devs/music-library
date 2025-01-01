import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Artist extends Model {
	public id!: string;
	public name!: string;
	public grammy!: boolean;
	public hidden!: boolean;
	public created_at!: Date;
	public updated_at!: Date;
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
