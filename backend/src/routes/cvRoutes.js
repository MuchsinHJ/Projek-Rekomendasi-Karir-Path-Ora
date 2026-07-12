import { Router } from 'express';
import * as cvController from '../controllers/cvController.js';
import * as analysisController from '../controllers/analysisController.js';
import requireAuth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.use(requireAuth);

// Resource: CV
router.post('/', upload.single('file'), cvController.createCv);
router.get('/', cvController.listCvs);
router.get('/:cvId', cvController.getCv);
router.delete('/:cvId', cvController.deleteCv);

// Sub-resource: analisis dari sebuah CV
router.post('/:cvId/analyze', analysisController.analyze);
router.get('/:cvId/analysis', analysisController.getLatestForCv);

export default router;
