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

    const order = await repo.createOrder(data);

    const order= await prisma.$transaction(async (tx) => {
        let totalAmount=0;
        
        for(const item of items){
            const product = await tx.product.findUnique({
                where: { id: item.productId },
            });
    
            if(!product) throw new Error('Product not found');
    
            totalAmount += product.price * item.quantity;
            
            //concurrency safe update
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
                throw new Error(`Insufficient stock for product : ${item.productId}`);
        };

        //Create irder AFTER inventory success
        const createOrder = await tx.order.create({
            data: {
                supplierId, 
                totalAmount,
                status: 'PENDING',
                items: {
                    create: items.map( (item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price, //optional override below
                    })),
                },
            },
            include: { items: true },
        });

        return createOrder;
    });

    //emit only after transaction success
    io.emit('Order_created', {
        orderId: order.id,
        supplierId: order.supplierId,
        totalAmount: order.totalAmount,
    });

    return order;
};