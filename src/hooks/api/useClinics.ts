import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'react-toastify';

export const useClinics = () => {
    return useQuery({
        queryKey: ['clinics'],
        queryFn: async () => {
            // Assuming a GET endpoint exists or will exist to fetch clinics
            const res = await apiClient.get('/clinics/');
            return res.data;
        },
    });
};

export const useCreateClinic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (clinicData: any) => {
            const res = await apiClient.post('/clinics/', clinicData);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Clinic created successfully');
            queryClient.invalidateQueries({ queryKey: ['clinics'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || 'Failed to create clinic');
        },
    });
};

export const useUpdateClinic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const res = await apiClient.patch(`/clinics/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Clinic updated successfully');
            queryClient.invalidateQueries({ queryKey: ['clinics'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || 'Failed to update clinic');
        },
    });
};

export const useClinicStats = (clinicId: string) => {
    return useQuery({
        queryKey: ['clinic-stats', clinicId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/clinics/${clinicId}/stats`);
            return data;
        },
        enabled: !!clinicId,
    });
};

export const useUploadClinicLogo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, file }: { id: string; file: File }) => {
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await apiClient.post(`/clinics/${id}/upload-logo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clinics'] });
            toast.success('Logo uploaded successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || 'Failed to upload logo');
        },
    });
};
