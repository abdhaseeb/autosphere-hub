import express from 'express';
import { getForecast, getInsights } from './ai.controller.js';
//import * as service from './ai.services.js';

const router = express.Router();

router.get('/forecast/:productId', getForecast);
router.get('/insights', getInsights);

export default router;
