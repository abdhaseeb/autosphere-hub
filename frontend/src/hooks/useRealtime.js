import { useEffect } from 'react';
import { socket } from '../api/socket.js';
import { useQueryClient } from '@tanstack/react-query';

export const useRealtime = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        socket.on('order_created', () => {
            //refresh KPIs + trend
            queryClient.invalidateQueries(['kpis']);
            queryClient.invalidateQueries(['orders-trend']);
        });

        socket.on('shipment_updated', () => {
            queryClient.invalidateQueries(['kpis']);
        });

        return () => {
            socket.off('order_created');
            socket.off('shipment_updated');
        };
    }, []);
};