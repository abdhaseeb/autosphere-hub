import { useQuery } from '@tanstack/react-query';
import { fetchKPIs, fetchOrdersTrend } from '../api/dashboard.api';

export const useKPIs = () => {
    return useQuery({
      queryKey: ['kpis'],
      queryFn: fetchKPIs,
      staleTime: 60 * 1000,
    });
};

export const useOrdersTrend = () => {
    return useQuery({
        queryKey: ['orders-trend'],
        queryFn: fetchOrdersTrend,
        staleTime: 60 * 1000,
    })
}