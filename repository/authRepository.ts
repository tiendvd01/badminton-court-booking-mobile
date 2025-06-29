import httpService from '@/libs/httpService';
import { useAuthStore } from '@/stores/authStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface LoginVariables {
    email: string;
    password: string;
}

export const signin = async (variables: LoginVariables) => {
    return httpService.post(`${process.env.EXPO_PUBLIC_API_URL}/users/login`, variables);
};

export const useLoginMutation = () => {
    const { login } = useAuthStore();
    const queryClient = useQueryClient();   
    return useMutation({
        mutationFn: async (variables: LoginVariables) => {
            const response = await signin(variables);
            return response.data;
        },
        onSuccess: (data) => {
            login(data.data.user, data.data.token);
            queryClient.invalidateQueries();
        },
    });
};

interface RegisterVariables {
    name: string;
    email: string;
    password: string;
    phone: string;
}

export const signup = async (variables: RegisterVariables) => {
    return httpService.post(`${process.env.EXPO_PUBLIC_API_URL}/users/register`, variables);
};

export const useSignupMutation = () => {
    const { login } = useAuthStore();
    const queryClient = useQueryClient();   
    return useMutation({
        mutationFn: async (variables: RegisterVariables) => {
            const response = await signup(variables);
            return response.data;
        },
        onSuccess: (data) => {
            login(data.data.user, data.data.token);
            queryClient.invalidateQueries();
        },
    });
};
