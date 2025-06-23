import httpService from '@/libs/httpService';
import { ILocation, IPriceTable, IResponse, ICourt } from '@/types/common';
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

interface GetLocationByIdParams {
    locationId: number;
}

export const getLocationById = ({ locationId }: GetLocationByIdParams) => {
    return httpService.get<IResponse & { data: ILocation }>(
        `${process.env.EXPO_PUBLIC_API_URL}/locations/${locationId}`
    );
};

export const LocationByIdQueryKey = (params: GetLocationByIdParams) => ['location-by-id', params];

export const useLocationByIdQuery = ({
    locationId,
    enabled = true,
    ...params
}: { enabled?: boolean } & GetLocationByIdParams) => {
    return useQuery({
        queryKey: LocationByIdQueryKey({ locationId, ...params }),
        queryFn: () => getLocationById({ locationId, ...params }),
        enabled: enabled && !!locationId,
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

interface GetCourtsByLocationParams {
    locationId: number;
}

export const getCourtsByLocation = ({ locationId }: GetCourtsByLocationParams) => {
    return httpService.get<IResponse & { data: ICourt[] }>(
        `${process.env.EXPO_PUBLIC_API_URL}/locations/${locationId}/courts`,
        { params: { locationId } }
    );
};

export const CourtsByLocationQueryKey = (params: GetCourtsByLocationParams) => ['courts-by-location', params];

export const useCourtsByLocationQuery = ({
    locationId,
    enabled = true,
    ...params
}: { enabled?: boolean } & GetCourtsByLocationParams) => {
    return useQuery({
        queryKey: CourtsByLocationQueryKey({ locationId, ...params }),
        queryFn: () => getCourtsByLocation({ locationId, ...params }),
        enabled: enabled && !!locationId,
    });
};

interface GetCourtByIdParams {
    courtId: number;
}

export const getCourtById = ({ courtId }: GetCourtByIdParams) => {
    return httpService.get<IResponse & { data: ICourt }>(
        `${process.env.EXPO_PUBLIC_API_URL}/locations/courts/${courtId}`
    );
};

export const CourtByIdQueryKey = (params: GetCourtByIdParams) => ['court-by-id', params];

export const useCourtByIdQuery = ({
    courtId,
    enabled = true,
    ...params
}: { enabled?: boolean } & GetCourtByIdParams) => {
    return useQuery({
        queryKey: CourtByIdQueryKey({ courtId, ...params }),
        queryFn: () => getCourtById({ courtId, ...params }),
        enabled: enabled && !!courtId,
    });
};


