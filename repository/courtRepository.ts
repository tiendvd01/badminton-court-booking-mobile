import httpService from '@/libs/httpService';
import { ILocation, IPriceTable, IResponse } from '@/types/common';
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

export const getPriceTablesByLocation = (locationId: number) => {
    return httpService.get<IResponse & { data: IPriceTable[] }>(`${process.env.EXPO_PUBLIC_API_URL}/price-tables/byLocation?locationId=${locationId}`);
}

export const PriceTablesByLocationQueryKey = ['price-tables-by-location'];

export const usePriceTablesByLocationQuery = ({ locationId, enabled = true }: { locationId: number; enabled?: boolean }) => {
    return useQuery({
        queryKey: PriceTablesByLocationQueryKey,
        queryFn: () => getPriceTablesByLocation(locationId),
        enabled,
    });
};
