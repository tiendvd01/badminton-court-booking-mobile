import httpService from '@/libs/httpService';
import { useQuery } from '@tanstack/react-query';

export const getAllProvinces = () => {
    return httpService.get('https://provinces.open-api.vn/api/?depth=2');
};

export const ProvinceQueryKey = ['provinces'];

export const useProvincesQuery = ({ enabled = true }: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ProvinceQueryKey,
        queryFn: getAllProvinces,
        enabled,
    });
};
