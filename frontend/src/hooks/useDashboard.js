import { useQuery } from '@tanstack/react-query';
import { fetchKPIs, fetchOrdersTrend } from '../api/dashboard.api';
//import { fetchKPIs, fetchOrdersTrend, fetchTopSuppliers } from '../api/dashboard.api';

export const useKPIs = () => {
    return useQuery({
      queryKey: ['kpis'],
      queryFn: fetchKPIs,
      staleTime: 60 * 1000, //data refresh for 1 min
      cacheTime: 2 * 60 * 1000 //stays in memory for 2 mins
    });
};

export const useOrdersTrend = () => {
    return useQuery({
        queryKey: ['orders-trend'],
        queryFn: fetchOrdersTrend,
        staleTime: 60 * 1000,
    })
}

// export const useTopSuppliers = () => {
//     return useQuery({
//         queryKey: ['top-suppliers'],
//         queryFn: fetchTopSuppliers,
//         staleTime: 60 * 1000,
//     })
// }