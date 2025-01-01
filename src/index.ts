import { createServer } from './server';
import sequelize from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function bootstrap() {
	try {
		// Initialize database connection
		await sequelize.authenticate();

		// Be careful with this in production, Uncomment to update db schema
		// await sequelize.sync({ alter: true });

		const app = await createServer();

		app.listen(PORT, () => {
			console.log('\n');
			console.log(`Server running on http://localhost:${PORT}/api/v1`);
			console.log('Database connection established');
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
	console.log(
		'SIGTERM received. Closing HTTP server and database connection...'
	);
	await sequelize.close();
	process.exit(0);
});

bootstrap();
