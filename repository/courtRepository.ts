import httpService from '@/libs/httpService';
import { ILocation, IResponse } from '@/types/common';
import { useQuery } from '@tanstack/react-query';

export const getLocations = () => {
    return httpService.get<IResponse & { data: ILocation[] }>(`${process.env.EXPO_PUBLIC_API_URL}/locations`);
};

export const LocationsQueryKey = ['locations'];

export const useLocationsQuery = ({ enabled = true }: { enabled?: boolean }) => {
    return useQuery({
        queryKey: LocationsQueryKey,
        queryFn: getLocations,
        enabled,
    });
};
