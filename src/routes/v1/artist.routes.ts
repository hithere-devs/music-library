import { Router } from 'express';

// controllers
import { ArtistController } from '../../controllers/artist.controller';

// schemas
import { artistSchemas } from '../../validators/artist.schema';

// middleware
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate-request';

// types
import { UserRole } from '../../types/enums';

const router = Router();
const artistController = new ArtistController();

router.get(
	'/',
	authenticate,
	validateRequest(artistSchemas.getArtists),
	artistController.getArtists.bind(artistController)
);

router.get(
	'/:id',
	authenticate,
	validateRequest(artistSchemas.deleteArtist),
	artistController.getArtistById.bind(artistController)
);

router.post(
	'/add-artist',
	authenticate,
	authorize(UserRole.ADMIN, UserRole.EDITOR),
	validateRequest(artistSchemas.addArtist),
	artistController.createArtist.bind(artistController)
);

router.put(
	'/:id',
	authenticate,
	authorize(UserRole.ADMIN, UserRole.EDITOR),
	validateRequest(artistSchemas.updateArtist),
	artistController.updateArtist.bind(artistController)
);

router.delete(
	'/:id',
	authenticate,
	authorize(UserRole.ADMIN, UserRole.EDITOR),
	validateRequest(artistSchemas.deleteArtist),
	artistController.deleteArtist.bind(artistController)
);

export default router;
