import * as service from './order.service.js';

export const getOrders = async (req, res) =>{
    try{
        const data = await service.getOrders(req.query);
        res.json(data);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

export const getOrderById = async(req, res) => {
    try{
        const {orderId} = req.params.id;
        const data = await service.getOrderById(orderId);
        if(!data) return res.status(404).json({Error: "Order not found"});
        
        res.json(data);
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

export const createOrder = async(req, res) => {
    try{
        const data = await service.createOrder(req.body);
        res.status(201).json(data);
    }catch(err){
        res.status(500).json({error: err.message});
    }
}