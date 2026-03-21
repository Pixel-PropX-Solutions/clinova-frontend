import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export type ContactQueryPayload = {
    fullName: string;
    phoneNumber: string;
    email: string;
    messageType: string;
    message: string;
};

type ContactQueryResponse = {
    message: string;
};

export const useSubmitContactQuery = () => {
    return useMutation({
        mutationFn: async (payload: ContactQueryPayload) => {
            const { data } = await apiClient.post<ContactQueryResponse>('/contact/', payload);
            return data;
        },
    });
};
