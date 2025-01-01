import dotenv from 'dotenv';
import { createServer } from './server';
import db from './models';

dotenv.config();

const { NODE_ENV } = process.env;

const PORT = process.env.PORT || 3000;

async function bootstrap() {
	try {
		await db.syncModels();
		const app = createServer();

		app.listen(PORT, () => {
			console.log('\n');
			console.log(
				`Server running on ${
					NODE_ENV === 'production'
						? 'https://music-library-api.hitheredevs.com/api/v1'
						: `http://localhost:${PORT}/api/v1`
				}`
			);
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
	await db.sequelize.close();
	process.exit(0);
});

bootstrap();
