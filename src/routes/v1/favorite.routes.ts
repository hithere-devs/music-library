import { Router } from 'express';

// controllers
import { FavoriteController } from '../../controllers/favorite.controller';

// schemas
import { favoriteSchemas } from '../../validators/favorite.schema';

// middlewares
import { authenticate } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate-request';

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
