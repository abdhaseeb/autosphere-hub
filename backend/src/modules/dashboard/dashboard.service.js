import { prisma } from '../../common/db.js';
import { redis } from '../../common/redis.js';

export const getKPIs = async() => {
    const cacheKey = 'dashboard:kpis';

    const cached = await redis.get(cacheKey);
    if(cached) return JSON.parse(cached);

    const totalOrders = await prisma.dailyStats.aggregate({
        _sum: {totalOrders: true},
    });
    //prisma Returns object -> 
    // { 
    //        _sum:{ totalOrders: xxx }, 
    //        _avg:{}, 
    //        _count: {}
    //    }

    const totalRevenue = await prisma.dailyStats.aggregate({
        _sum: { totalRevenue: true}
    });

    const delivered = await prisma.dailyStats.aggregate({
        _sum: { deliveredCount: true }
    })

    const result = {
        totalOrders: totalOrders._sum.totalOrders || 0, // hence totalOrders._sum.totalOrders
        totalRevenue: totalRevenue._sum.totalRevenue || 0,
        fulfillmentRate: ( delivered._sum.deliveredCount / totalOrders._sum.totalOrders ) * 100,
    }

    await redis.set(cacheKey, JSON.stringify(result), 'EX', 60);
    return result;
};

export const getOrdersTrend = async() => {
    return prisma.dailyStats.findMany({
        orderBy: {date: 'asc'},
    });
};