import { Router } from 'express';
import { TrackController } from '../../controllers/track.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate-request';
import { trackSchemas } from '../../validators/track.schema';
import { UserRole } from '../../types/enums';

const router = Router();
const trackController = new TrackController();

router.get(
	'/',
	authenticate,
	validateRequest(trackSchemas.getTracks),
	trackController.getTracks.bind(trackController)
);

router.get(
	'/:id',
	authenticate,
	validateRequest(trackSchemas.deleteTrack),
	trackController.getTrackById.bind(trackController)
);

router.post(
	'/add-track',
	authenticate,
	authorize(UserRole.ADMIN, UserRole.EDITOR),
	validateRequest(trackSchemas.addTrack),
	trackController.createTrack.bind(trackController)
);

router.put(
	'/:id',
	authenticate,
	authorize(UserRole.ADMIN, UserRole.EDITOR),
	validateRequest(trackSchemas.updateTrack),
	trackController.updateTrack.bind(trackController)
);

router.delete(
	'/:id',
	authenticate,
	authorize(UserRole.ADMIN, UserRole.EDITOR),
	validateRequest(trackSchemas.deleteTrack),
	trackController.deleteTrack.bind(trackController)
);

export default router;
