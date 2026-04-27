import {Worker} from 'bullmq';
import { redis } from '../common/redis.js';
import { prisma } from '../common/db.js';

const worker = new Worker(
    'dashboard',
    async job => {
        if(job.name === 'compute-daily-stats') {
            await computeDailyStats();
        }
    },
    { connection: redis },
)

async function computeDailyStats(){
    const result = await prisma.$queryRaw`
        SELECT DATE("createdAt") as date,
            COUNT(*) as total_orders,
            SUM("totalAmount") as revenue,
            COUNT(*) FILTER (WHERE status = "DELIVERED") as delivered,
            COUNT(*) FILTER (WHERE status = "SHIPPED") as shipped
        FROM "Order"
        GROUP BY date
    `;

    for(const row of result){
        await prisma.dailyStats.upsert({
            where: { date: row.date },
            update: {
                totalOrders: Number(row.total_orders),
                totalRevenue: Number(row.revenue),
                deliveredCount: Number(row.delivered),
                shippedCount: Number(row.shipped),
            },
            create: {
                date: row.date,
                totalOrders: Number(row.total_orders),
                totalRevenue: Number(row.revenue),
                deliveredCount: Number(row.delivered),
                shippedCount: Number(row.shipped),
            },
        });
    }
}