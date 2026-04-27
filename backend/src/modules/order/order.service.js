import * as repo from './order.repository.js';
import {prisma} from '../../common/db.js';

export const getOrders = async(query) => {
    return repo.findOrders(query);
}

export const getOrderById = async(id) => {
    return repo.findOrderById(id);
}

export const createOrder = async(data) => {
    const {supplierId, items} = data;

    return prisma.$transaction(async (tx) => {
        let totalAmount=0;
        
        for(const item of items){
            const product = await tx.product.findUnique({
                where: { id: item.productId },
            });
    
            if(!product) throw new Error('Product not found');
    
            const inventory = await tx.inventory.findUnique({
                where: {productId: item.productId}
            })
            if(!inventory || inventory.availableQty < item.quantity){
                throw new Error(`Insufficient stock for item ${item.productId}`);
            } 
    
            totalAmount += product.price * item.quantity;
            
            //safe update
            const updated = await tx.inventory.updateMany({
                where: { 
                    productId: item.productId,
                    availableQty: {gte: item.quantity}, //concurrency safe
                 },
                data: {
                    availableQty : {decrement: item.quantity},
                    reservedQty: {increment: item.quantity}
                },
            });

            if(updated.count === 0)
                    throw new Error(`Race condition: Stock changed for ${item.productId}`);
        };

        //calc + validate inventory
        const order = await tx.order.create({
            data: {
                supplierId, 
                totalAmount,
                status: 'PENDING',
                items: {
                    create: items,
                },
            },
            include: { items: true },
        });

        return order;
    });

};