import { Router } from 'express';
import { FavoriteController } from '../../controllers/favorite.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate-request';
import { favoriteSchemas } from '../../validators/favorite.schema';

const router = Router();
const favoriteController = new FavoriteController();

router.get(
	'/:category',
	authenticate,
	validateRequest(favoriteSchemas.getFavorites),
	favoriteController.getFavorites.bind(favoriteController)
);

router.post(
	'/add-favorite',
	authenticate,
	validateRequest(favoriteSchemas.addFavorite),
	favoriteController.addFavorite.bind(favoriteController)
);

router.delete(
	'/remove-favorite/:id',
	authenticate,
	validateRequest(favoriteSchemas.deleteFavorite),
	favoriteController.removeFavorite.bind(favoriteController)
);

export default router;
