import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export const useAuthMutation = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const router = useRouter();

    return useMutation({
        mutationFn: async (credentials: Record<string, string>) => {
            const response = await apiClient.post('/auth/login', {
                email: credentials.email,
                password: credentials.password
            });
            console.log("Login Response", response);
            return response.data;
        },
        onSuccess: (data: any) => {
            console.log("Login Response Success data", data);
            setAuth(data.access_token, data.role);
            toast.success('Login successful');
            if (data.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        },
        onError: (error: any) => {
             console.log("Login Error", error);
            toast.error(error?.response?.data?.detail || 'Login failed. Please check credentials.');
        },
    });
};

export const useLogoutMutation = () => {
    const logoutStore = useAuthStore((state) => state.logout);
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            const response = await apiClient.post('/auth/logout');
            return response.data;
        },
        onSuccess: () => {
            logoutStore();
            toast.success('Logged out successfully');
            router.push('/');
        },
        onError: () => {
            logoutStore();
            router.push('/');
        }
    });
};

export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: async (email: string) => {
            const response = await apiClient.post('/auth/forgot-password', { email });
            return response.data;
        },
        onSuccess: (data: any) => {
            toast.success(data.message || 'If this email is registered, you will receive your new password shortly.');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || 'Failed to request password reset. Please try again.');
        }
    });
};
