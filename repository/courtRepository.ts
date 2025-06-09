import httpService from '@/libs/httpService';
import { ILocation, IPriceTable, IResponse } from '@/types/common';
import { useQuery } from '@tanstack/react-query';

interface GetLocationsParams {
    province?: string;
    district?: string;
    search?: string;
}

export const getLocations = (params?: GetLocationsParams) => {
    return httpService.get<IResponse & { data: ILocation[] }>(
        `${process.env.EXPO_PUBLIC_API_URL}/locations`,
        { params }
    );
};

export const LocationsQueryKey = (params?: GetLocationsParams) => ['locations', params];

export const useLocationsQuery = ({
    enabled = true,
    ...params
}: { enabled?: boolean } & GetLocationsParams = {}) => {
    return useQuery({
        queryKey: LocationsQueryKey(params),
        queryFn: () => getLocations(params),
        enabled,
    });
};

interface GetPriceTablesByLocationParams {
    locationId: number;
    // Add other potential query parameters here if needed in the future
}

export const getPriceTablesByLocation = ({ locationId }: GetPriceTablesByLocationParams) => {
    return httpService.get<IResponse & { data: IPriceTable[] }>(
        `${process.env.EXPO_PUBLIC_API_URL}/price-tables/byLocation`,
        { params: { locationId } }
    );
};

export const PriceTablesByLocationQueryKey = (params: GetPriceTablesByLocationParams) => ['price-tables-by-location', params];

export const usePriceTablesByLocationQuery = ({
    locationId,
    enabled = true,
    ...params
}: { enabled?: boolean } & GetPriceTablesByLocationParams) => {
    return useQuery({
        queryKey: PriceTablesByLocationQueryKey({ locationId, ...params }),
        queryFn: () => getPriceTablesByLocation({ locationId, ...params }),
        enabled: enabled && !!locationId,
    });
};
