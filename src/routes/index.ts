import { Router } from 'express';
import v1Routes from './v1';
import sequelize from '../config/database';

const router = Router();

// Health check route
router.get('/health', async (_req, res) => {
	try {
		await sequelize.authenticate();
		res.status(200).json({
			status: 200,
			message: 'Server is healthy, database connection established',
			error: null,
		});
	} catch (error) {
		res.status(503).json({
			status: 503,
			message: 'Server is unhealthy, database connection failed',
			error: error,
		});
	}
});

// Mount v1 routes under /api/v1
router.use('/api/v1', v1Routes);

// Handle 404 for unknown routes
router.use('*', (_req, res) => {
	res.status(404).json({
		status: 404,
		message: 'Route not found',
		error: 'The requested resource does not exist',
	});
});

export default router;
