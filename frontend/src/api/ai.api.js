import {api} from './client.js';

export const fetchInsights = async () => {
    const data = await api.get('/ai/insights');
    return data;
}

export const fetchForecast = async(productId) => {
    const data = await api.get('/ai/forecast/:productId');
    return data;
}