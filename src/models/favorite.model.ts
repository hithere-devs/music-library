import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { FavoriteType } from '../types/enums';

class Favorite extends Model {
	public id!: string;
	public user_id!: string;
	public favorite_id!: string;
	public favorite_type!: FavoriteType;
	public created_at!: Date;
	public updated_at!: Date;
}

Favorite.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			field: 'favorite_id',
		},
		user_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'users',
				key: 'user_id',
			},
		},
		favorite_id: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		favorite_type: {
			type: DataTypes.ENUM(...Object.values(FavoriteType)),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Favorite',
		tableName: 'favorites',
		timestamps: true,
		underscored: true,
	}
);

export default Favorite;
