import httpService from "@/libs/httpService";
import { IResponse } from "@/types/common";
import { useMutation } from "@tanstack/react-query";

interface UploadImageRes extends IResponse {
    data: {
        url: string;
    }
};
const uploadImage = async (data: any) => {

    return httpService.post<UploadImageRes>(`${process.env.EXPO_PUBLIC_API_URL}/upload/image`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const useUploadImageMutation = () => {
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await uploadImage(data);
            return response.data;
        },
    });
};
