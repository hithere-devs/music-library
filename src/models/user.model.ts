import { Model, DataTypes } from 'sequelize';

// config
import sequelize from '../config/database';

// models
import Favorite from './favorite.model';

// types
import { UserRole } from '../types/enums';

class User extends Model {
	public id!: string;
	public email!: string;
	public password!: string;
	public role!: UserRole;
	public created_at!: Date;
	public updated_at!: Date;
	public favoriates!: Favorite[];
}

User.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			field: 'user_id',
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		role: {
			type: DataTypes.ENUM(...Object.values(UserRole)),
			allowNull: false,
			defaultValue: UserRole.VIEWER,
		},
	},
	{
		sequelize,
		modelName: 'User',
		tableName: 'users',
		timestamps: true,
		underscored: true,
	}
);

export default User;
