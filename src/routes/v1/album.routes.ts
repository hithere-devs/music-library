import { Router } from 'express';

// controllers
import { AlbumController } from '../../controllers/album.controller';

// schemas
import { albumSchemas } from '../../validators/album.schema';

// middleware
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate-request';

// types
import { UserRole } from '../../types/enums';

const router = Router();
const albumController = new AlbumController();

router.get(
	'/',
	authenticate,
	validateRequest(albumSchemas.getAlbums),
	albumController.getAlbums.bind(albumController)
);

router.get(
	'/:id',
	authenticate,
	validateRequest(albumSchemas.deleteAlbum),
	albumController.getAlbumById.bind(albumController)
);

router.post(
	'/add-album',
	authenticate,
	authorize(UserRole.ADMIN, UserRole.EDITOR),
	validateRequest(albumSchemas.addAlbum),
	albumController.createAlbum.bind(albumController)
);

router.put(
	'/:id',
	authenticate,
	authorize(UserRole.ADMIN, UserRole.EDITOR),
	validateRequest(albumSchemas.updateAlbum),
	albumController.updateAlbum.bind(albumController)
);

router.delete(
	'/:id',
	authenticate,
	authorize(UserRole.ADMIN, UserRole.EDITOR),
	validateRequest(albumSchemas.deleteAlbum),
	albumController.deleteAlbum.bind(albumController)
);

export default router;
