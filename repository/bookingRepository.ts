import httpService from "@/libs/httpService"
import { useMutation, useQuery } from "@tanstack/react-query";
import { IBooking } from "@/types/common";
import { IResponse } from "@/types/common";

interface CreateBookingParams {
    slots: {
      courtId: number;
      startTime: string;
      endTime: string;
    }[],
    locationId: number;
    customer_info: {
      name: string;
      phone_number: string;
    };
    booking_date: string;
    note?: string;
}

export const createBookings = (data: CreateBookingParams) => {
  return httpService.post<IResponse & { data: IBooking }>(`${process.env.EXPO_PUBLIC_API_URL}/bookings`, data);
}

export const useCreateBookingMutation = () => {
  return useMutation({
    mutationFn: (data: CreateBookingParams) => createBookings(data),
    onError: (error) => {
      console.error('Failed to create booking:', error);
    }
  });
}

interface GetBookingByIdParams {
    bookingId: number;
}

export const getBookingById = (data: GetBookingByIdParams) => {
    return httpService.get<IResponse & { data: IBooking }>(`${process.env.EXPO_PUBLIC_API_URL}/bookings/${data.bookingId}`);
}

export const BookingByIdQueryKey = (params: GetBookingByIdParams) => ['booking-by-id', params];

export const useBookingByIdQuery = (params: GetBookingByIdParams) => {
    return useQuery({
        queryKey: BookingByIdQueryKey(params),
        queryFn: () => getBookingById(params),
        enabled: !!params.bookingId,
    });
}



