import { Router } from 'express';
import { getArtisans, getArtisanAnalytics } from '../controllers/artisanController.js';

const router = Router();

router.get('/', getArtisans);
router.get('/:id/analytics', getArtisanAnalytics);

export default router;
