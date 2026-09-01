import { Router } from 'express';
import multer from 'multer';
import { analyzeCraftImage, getFairPriceEstimate } from '../controllers/aiController.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
const router = Router();

router.post('/analyze-craft', upload.single('image'), analyzeCraftImage);
router.post('/pricing-estimate', getFairPriceEstimate);

export default router;
