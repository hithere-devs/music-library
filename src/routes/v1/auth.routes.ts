import { Router } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { validateRequest } from '../../middleware/validate-request';
import { authSchemas } from '../../validators/auth.schema';

const router = Router();
const authController = new AuthController();

router.post(
	'/signup',
	validateRequest(authSchemas.signup),
	authController.signup.bind(authController)
);

router.post(
	'/login',
	validateRequest(authSchemas.login),
	authController.login.bind(authController)
);

validateRequest(authSchemas.signup),
	router.get(
		'/logout',
		validateRequest(authSchemas.logout),
		authController.logout.bind(authController)
	);

export default router;
