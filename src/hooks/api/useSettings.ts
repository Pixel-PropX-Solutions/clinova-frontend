import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'react-toastify';

// Get clinic profile
export const useClinicProfile = () => {
    return useQuery({
        queryKey: ['clinic-profile'],
        queryFn: async () => {
            const { data } = await apiClient.get('/settings/profile');
            console.log('Clinic profile data:', data);
            return data;
        },
    });
};

// Update clinic profile
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (profileData: {
            name?: string;
            phone?: string;
            address?: string;
            logo_url?: string;
            default_template_id?: string;
        }) => {
            const { data } = await apiClient.patch(
                '/settings/profile',
                profileData,
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clinic-profile'] });
            toast.success('Profile updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || 'Failed to update profile');
        },
    });
};

// Upload logo
export const useUploadLogo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await apiClient.post('/settings/upload-logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clinic-profile'] });
            toast.success('Logo uploaded successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || 'Failed to upload logo');
        },
    });
};

// Change password
export const useChangePassword = () => {
    return useMutation({
        mutationFn: async (passwords: { current_password: string; new_password: string }) => {
            const { data } = await apiClient.post('/settings/change-password', passwords);
            return data;
        },
        onSuccess: () => {
            toast.success('Password changed successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || 'Failed to change password');
        },
    });
};

// Set default template
export const useSetDefaultTemplate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (template_id: string) => {
            const { data } = await apiClient.post('/settings/default-template', { template_id });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clinic-profile'] });
            toast.success('Default template updated');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || 'Failed to set default template');
        },
    });
};
