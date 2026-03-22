import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'react-toastify';

export const useCreateVisit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (visitData: any) => {
            const res = await apiClient.post('/visits/', visitData);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Visit receipt created successfully');
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['patients'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || 'Failed to create visit');
        },
    });
};

export const usePatientVisits = (patientId: string) => {
    return useQuery({
        queryKey: ['visits', patientId],
        queryFn: async () => {
            if (!patientId) return [];
            const { data } = await apiClient.get(`/visits/${patientId}`);
            return data;
        },
        enabled: !!patientId,
    });
};

export const useDeleteVisit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (visitId: string) => {
            await apiClient.delete(`/visits/${visitId}`);
        },
        onSuccess: () => {
            toast.success('Visit deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            queryClient.invalidateQueries({ queryKey: ['visits'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || 'Failed to delete visit');
        },
    });
};
