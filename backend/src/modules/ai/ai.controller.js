import * as service from './ai.services.js';

export const getForecast = async(req, res) => {
    const {productId} = req.params;

    const data = await service.getDemandForecast(productId);
    res.json(data);
};

export const getInsights = async(req, res) => {
    const insights = await service.generateInsights();

    res.json(insights);
}