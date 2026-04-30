import express from 'express';
import * as controller from './order.controller.js';

const router = express.Router();

router.get('/', controller.getOrders);
router.get('/:id', controller.getOrderById);
router.post('/', controller.createOrder);
//router.patch('/orders/:id/status', controller.orderUpdate)

export default router;