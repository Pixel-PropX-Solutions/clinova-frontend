import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const useTemplates = () => {
    return useQuery({
        queryKey: ['templates'],
        queryFn: async () => {
            const { data } = await apiClient.get('/templates/');
            return data;
        },
    });
};

// Admin Hooks
export const useAdminTemplates = () => {
    return useQuery({
        queryKey: ['admin-templates'],
        queryFn: async () => {
            const { data } = await apiClient.get('/templates/admin');
            return data;
        },
    });
};

export const useCreateAdminTemplate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (templateData: any) => {
            const { data } = await apiClient.post('/templates/admin', templateData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-templates'] });
        },
    });
};

export const useUpdateAdminTemplate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const { data: responseData } = await apiClient.patch(
                `/templates/admin/${id}`,
                data
            );
            return responseData;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-templates'] });
        },
    });
};

export const useDeleteAdminTemplate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await apiClient.delete(`/templates/admin/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-templates'] });
        },
    });
};
