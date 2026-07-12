import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import requireAuth from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/schemas.js';

const router = Router();

router.use(requireAuth);
router.get('/me', userController.getMe);
router.patch('/me', validate(updateProfileSchema), userController.updateMe);

export default router;
