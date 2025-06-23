import httpService from '@/libs/httpService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { IBooking } from '@/types/common';
import { IResponse } from '@/types/common';

interface CreateBookingParams {
    slots: {
        courtId: number;
        startTime: string;
        endTime: string;
    }[];
    location_id: number;
    customer_info: {
        name: string;
        phone_number: string;
    };
    booking_date: string;
    note?: string;
}

export const createBookings = (data: CreateBookingParams) => {
    return httpService.post<IResponse & { data: IBooking }>(`${process.env.EXPO_PUBLIC_API_URL}/bookings`, data);
};

export const useCreateBookingMutation = () => {
    return useMutation({
        mutationFn: (data: CreateBookingParams) => createBookings(data),
        onError: (error) => {
            console.error('Failed to create booking:', error);
        },
    });
};

interface GetBookingsParams {
    locationId: number;
    customerName?: string;
    bookingDate?: string;
    status?: string[];
}

interface GetBookingsQueryKeyParams {
    locationId: number;
    customerName?: string;
    bookingDate?: string;
    status?: string[];
}

export const getBookings = (params: GetBookingsParams) => {
    return httpService.get<IResponse & { data: IBooking[] }>(
        `${process.env.EXPO_PUBLIC_API_URL}/bookings`,
        { params }
    );
};

export const BookingsQueryKey = (params: GetBookingsQueryKeyParams) => ['bookings', params];

export const useBookingsQuery = (params: GetBookingsQueryKeyParams) => {
    return useQuery({
        queryKey: BookingsQueryKey(params),
        queryFn: () => getBookings(params),
        enabled: !!params.locationId,
    });
};

interface GetBookingByIdParams {
    bookingId: number;
}

export const getBookingById = (data: GetBookingByIdParams) => {
    return httpService.get<IResponse & { data: IBooking }>(
        `${process.env.EXPO_PUBLIC_API_URL}/bookings/${data.bookingId}`,
    );
};

export const BookingByIdQueryKey = (params: GetBookingByIdParams) => ['booking-by-id', params];

export const useBookingByIdQuery = (params: GetBookingByIdParams) => {
    return useQuery({
        queryKey: BookingByIdQueryKey(params),
        queryFn: () => getBookingById(params),
        enabled: !!params.bookingId,
    });
};

export const customerConfirmBooking = (data: { id: number; paymentImageUrl: string }) => {
    return httpService.put<IResponse & { data: IBooking }>(
        `${process.env.EXPO_PUBLIC_API_URL}/bookings/${data.id}/confirm`,
        {
            paymentImageUrl: data.paymentImageUrl,
        },
    );
};

export const useCustomerConfirmBookingMutation = () => {
    return useMutation({
        mutationFn: (data: { id: number; paymentImageUrl: string }) => customerConfirmBooking(data),
    });
};

export const cancelBooking = (data: { bookingId: number }) => {
    return httpService.put<IResponse & { data: IBooking }>(
        `${process.env.EXPO_PUBLIC_API_URL}/bookings/${data.bookingId}/cancel`,
    );
};

export const useCancelBookingMutation = () => {
    return useMutation({
        mutationFn: (data: { bookingId: number }) => cancelBooking(data),
    });
};
