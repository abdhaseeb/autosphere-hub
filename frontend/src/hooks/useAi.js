import { useQuery } from '@tanstack/react-query';
import { fetchForecast, fetchInsights } from '../api/ai.api';

export const useAiInsights = () => {
    return useQuery({
        queryKey: ['ai-insights'],
        queryFn: fetchInsights,
        staleTime: 5 * 60 * 1000,
    });
};

export const useForecast = () => {
    return useQuery({
        queryKey: ['forecast'],
        queryFn: fetchForecast,
        staleTime: 5*60*1000,
    });
}