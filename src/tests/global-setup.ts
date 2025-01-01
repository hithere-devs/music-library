import db from '../models';
import { request } from './setup';

// Export single async function that handles both setup and teardown
export default async function () {
	// Setup
	await db.sequelize.sync({ force: true });

	// Create initial admin user
	await request.post('/api/v1/signup').send({
		email: 'admin@example.com',
		password: 'password',
	});

	// Return teardown function
	return async () => {
		await db.sequelize.close();
	};
}
