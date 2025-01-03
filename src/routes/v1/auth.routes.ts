import { Router } from 'express';

// controllers
import { AuthController } from '../../controllers/auth.controller';

// schemas
import { authSchemas } from '../../validators/auth.schema';

// middleware
import { validateRequest } from '../../middleware/validate-request';

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

router.get(
	'/logout',
	validateRequest(authSchemas.logout),
	authController.logout.bind(authController)
);

export default router;
