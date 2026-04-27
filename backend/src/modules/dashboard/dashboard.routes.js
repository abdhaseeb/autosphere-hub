import express from 'express';
import * as controller from './dashboard.controller.js';
import { dashboardQueue } from '../../jobs/queue.js';

const router = express.Router();

router.get('/kpis', controller.getKPIs);
router.get('/orders-trend', controller.getOrdersTrend);

await dashboardQueue.add('compute-daily-stats', {});

export default router;