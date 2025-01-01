import { Router } from 'express';
import { UserController } from '../../controllers/user.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate-request';
import { userSchemas } from '../../validators/user.schema';
import { UserRole } from '../../types/enums';

const router = Router();
const userController = new UserController();

router.get(
	'/',
	authenticate,
	authorize(UserRole.ADMIN),
	validateRequest(userSchemas.getUsers),
	userController.getUsers.bind(userController)
);

router.post(
	'/add-user',
	authenticate,
	authorize(UserRole.ADMIN),
	validateRequest(userSchemas.addUser),
	userController.addUser.bind(userController)
);

router.delete(
	'/:id',
	authenticate,
	authorize(UserRole.ADMIN),
	validateRequest(userSchemas.deleteUser),
	userController.deleteUser.bind(userController)
);

router.put(
	'/update-password',
	authenticate,
	validateRequest(userSchemas.updatePassword),
	userController.updatePassword.bind(userController)
);

export default router;
