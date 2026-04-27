import {Queue} from 'bullmq';
import { redis } from '../common/redis.js';

export const dashboardQueue = new Queue('dashboard', {
    connection: redis,
});
