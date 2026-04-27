import {prisma} from '../../common/db.js';

export const findOrders = async() => {
    return prisma.order.findMany({
        include:{
            items: true,
            shipment: true,
        },
        orderBy: {createAt: 'desc'},
        take: 50, //prevent huge payloads
    });
};

export const findOrderById = async(orderId) => {
    return prisma.order.findUnique({
        where: {id: orderId},
        include: {
            items: true,
            shipment: true,
        },
    });
};

//not using right now bcoz we are using txn for atomicity in order.service.js
export const createOrder = async({ supplierId, totalAmount, items }) => {
    return prisma.order.create({
        data: {
            supplierId,
            totalAmount,
            status: 'PENDING',
            items: {
                create: items,
            },
        },
    });
};