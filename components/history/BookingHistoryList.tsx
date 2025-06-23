import React from 'react';
import BookingHistoryItem from './BookingHistoryItem';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

function BookingHistoryList() {
    const storage = useAsyncStorage('bookingIds');
    const [bookingIds, setBookingIds] = React.useState<string[]>([]);

    React.useEffect(() => {
        const loadBookingIds = async () => {
            try {
                const value = await storage.getItem();
                if (value) {
                    const ids: string[] = JSON.parse(value);
                    // Use Set to remove duplicates
                    const uniqueIds = [...new Set(ids)];
                    setBookingIds(uniqueIds);
                }
            } catch (error) {
                console.error('Failed to load booking IDs', error);
            }
        };

        loadBookingIds();
    }, [storage]);

    return (
        <>
            {bookingIds.map((id) => {
                return (
                    <BookingHistoryItem
                        key={id}
                        bookingId={id}
                        onPress={() => router.push(`/history/${id}`)}
                    />
                );
            })}
        </>
    );
}

export default BookingHistoryList;
