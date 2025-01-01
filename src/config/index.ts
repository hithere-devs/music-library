import dotenv from 'dotenv';

dotenv.config();

const config = {
	env: process.env.NODE_ENV || 'development',
	port: parseInt(process.env.PORT || '3000'),
	db: {
		dialect: 'postgres' as const,
		host: process.env.DB_HOST || 'localhost',
		port: parseInt(process.env.DB_PORT || '5432'),
		database: process.env.DB_NAME || 'music_library',
		username: process.env.DB_USER || 'postgres',
		password: process.env.DB_PASSWORD || 'postgres',
	},
	jwt: {
		secret: process.env.JWT_SECRET || 'your-secret-key',
		expiresIn: '24h',
	},
};

export default config;
