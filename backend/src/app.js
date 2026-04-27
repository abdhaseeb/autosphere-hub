import express from 'express';
import cors from 'cors';

import orderRoutes from '/modules/order/order.routes.js';
import dashboardRoutes from '/modules/order/dashboard.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

export const app;