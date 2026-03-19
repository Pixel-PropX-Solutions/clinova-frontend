import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'react-toastify';

export const useSearchPatient = (phone: string) => {
    return useQuery({
        queryKey: ['patients', 'search', phone],
        queryFn: async () => {
            if (!phone) return null;
            const res = await apiClient.get(`/patients/search?phone=${phone}`);
            return res.data;
        },
        enabled: !!phone && phone.length >= 4, // Only search when there are enough characters
    });
};

export const useCreatePatient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (patientData: any) => {
            const res = await apiClient.post('/patients/', patientData);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Patient registered successfully');
            queryClient.invalidateQueries({ queryKey: ['patients'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || 'Failed to register patient');
        },
    });
};

export const usePatientsList = (page: number, limit: number, sortBy: string = '_id', sortDesc: boolean = true) => {
    return useQuery({
        queryKey: ['patients', 'list', page, limit, sortBy, sortDesc],
        queryFn: async () => {
            const res = await apiClient.get('/patients/', {
                params: {
                    page,
                    limit,
                    sort_by: sortBy,
                    sort_desc: sortDesc,
                }
            });
            return res.data;
        },
    });
};

export const usePatientProfile = (patientId: string) => {
    return useQuery({
        queryKey: ['patients', 'profile', patientId],
        queryFn: async () => {
            if (!patientId) return null;
            const res = await apiClient.get(`/patients/${patientId}/profile`);
            console.log('Patients Data', res);
            return res.data;
        },
        enabled: !!patientId,
    });
};
