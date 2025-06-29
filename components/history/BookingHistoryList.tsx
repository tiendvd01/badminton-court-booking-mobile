import React from 'react';
import BookingHistoryItem from './BookingHistoryItem';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useBookingsQuery } from '@/repository/bookingRepository';
import { IBooking } from '@/types/common';

function BookingHistoryList() {
    const { user } = useAuthStore();
    const storage = useAsyncStorage('bookingIds');
    const [bookingIds, setBookingIds] = React.useState<string[]>([]);
    const bookingsQueryByCustomerId = useBookingsQuery({ customerId: user?.id });

    React.useEffect(() => {
        const loadBookingIds = async () => {
            try {
                if (user) {
                    setBookingIds(
                        bookingsQueryByCustomerId.data?.data.data.map((booking: IBooking) => booking.id.toString()) ||
                            [],
                    );
                } else {
                    const value = await storage.getItem();
                    if (value) {
                        const ids: string[] = JSON.parse(value);
                        // Use Set to remove duplicates
                        const uniqueIds = [...new Set(ids)];
                        setBookingIds(uniqueIds);
                    }
                }
            } catch (error) {
                console.error('Failed to load booking IDs', error);
            }
        };

        loadBookingIds();
    }, [user]);

    return (
        <>
            {bookingIds.map((id) => {
                return <BookingHistoryItem key={id} bookingId={id} onPress={() => router.push(`/history/${id}`)} />;
            })}
        </>
    );
}

export default BookingHistoryList;
