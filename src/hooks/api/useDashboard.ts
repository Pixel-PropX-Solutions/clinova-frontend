import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const useDashboardStats = (startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: ['dashboard', 'stats', startDate, endDate],
        queryFn: async () => {
            const res = await apiClient.get('/dashboard/stats', {
                params: {
                    start_date: startDate,
                    end_date: endDate
                }
            });
            return res.data;
        },
    });
};
