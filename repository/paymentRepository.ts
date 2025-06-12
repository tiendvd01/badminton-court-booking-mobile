import httpService from "@/libs/httpService";
import { IOwnerPayment, IResponse } from "@/types/common";
import { useQuery } from "@tanstack/react-query";

interface GetOwnerPaymenstByOwnerIdParams {
    id: number;
    isActive?: boolean;
}

export const getOwnerPaymentsByOwnerId = (params: GetOwnerPaymenstByOwnerIdParams) => {
    return httpService.get<IResponse & { data: IOwnerPayment[] }>(`${process.env.EXPO_PUBLIC_API_URL}/owner-payments`, {
      params: {
        owner_id: params.id,
        isActive: params.isActive
      }
    });
}

export const OwnerPaymentsByOwnerIdQueryKey = (params: GetOwnerPaymenstByOwnerIdParams) => ['owner-payments-by-owner-id', params];

export const useOwnerPaymentsByOwnerIdQuery = (params: GetOwnerPaymenstByOwnerIdParams) => {
    return useQuery({
        queryKey: OwnerPaymentsByOwnerIdQueryKey(params),
        queryFn: () => getOwnerPaymentsByOwnerId(params),
        enabled: !!params.id,
    });
}


