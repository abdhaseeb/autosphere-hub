import * as service from './dashboard.service.js';

export const getKPIs = async (req, res) => {
    try{
        const data = await service.getKPIs();
        res.json(data);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

export const getOrdersTrend = async (req, res) => {
    try{
        const data = await service.getOrdersTrend();
        res.json(data);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

