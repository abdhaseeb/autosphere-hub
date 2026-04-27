import { api } from "./client.js";

export const fetchKPIs = async () => {
    const {data} = await api.get('/dashboard/kpis')
    return data;
}

export const fetchOrdersTrend = async() => {
    const {data} = await api.get('/dashboard/order-trend');
    return data;
}

export const fetchTopSuppliers = async() => {
    const { data } = await api.get('/dashboard/top-suppliers');
    return data;
}