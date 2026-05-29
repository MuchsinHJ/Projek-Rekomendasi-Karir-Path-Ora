import { Router } from 'express';
import * as analysisController from '../controllers/analysisController.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', analysisController.listAnalyses);
router.get('/:analysisId', analysisController.getAnalysis);

export default router;
