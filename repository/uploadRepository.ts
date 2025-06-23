import httpService from "@/libs/httpService";
import { IResponse } from "@/types/common";
import { useMutation } from "@tanstack/react-query";

interface UploadImageRes extends IResponse {
    data: {
        url: string;
    }
};
const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    return httpService.post<UploadImageRes>(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const useUploadImageMutation = () => {
    return useMutation({
        mutationFn: async (file: File) => {
            const response = await uploadImage(file);
            return response.data;
        },
    });
};
