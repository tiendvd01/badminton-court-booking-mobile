import {
    useCourtsByLocationQuery,
    useLocationByIdQuery,
    usePriceTablesByLocationQuery,
} from '@/repository/courtRepository';
import { ICourt } from '@/types/common';
import { getTimeRange } from '@/utils/helper';
import React, { useState, useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import AppButton from '../ui/AppButton';
import { useBookingStore } from '@/stores/bookingStore';
import { useRouter } from 'expo-router';
import { useBookingsQuery } from '@/repository/bookingRepository';
import { states } from './CourtStateInfo';

type Props = {
    locationId: number;
    bookingDate: string;
};

const isPastDate = (dateString: string, timeSlot: string): boolean => {
    const now = new Date();
    const [year, month, day] = dateString.split('-').map(Number);
    const [hours, minutes] = timeSlot.split(':').map(Number);
    
    // Create a Date object for the booking time
    const bookingDateTime = new Date(year, month - 1, day, hours, minutes);
    
    // Compare the exact date and time
    return now > bookingDateTime;
};

export type SelectedCell = {
    courtId: number;
    startTime: string;
    endTime: string;
    courtData?: ICourt; // Optional for future use if needed
};

function BookingSheet({ locationId, bookingDate }: Props) {
    const locationQuery = useLocationByIdQuery({ locationId });
    const bookingsQuery = useBookingsQuery({ locationId, status: ['pending', 'confirmed', 'completed'], bookingDate });
    const bookedSlots = bookingsQuery.data?.data?.data?.reduce(
        (acc, booking) => {
            booking.slots.forEach((slot) => {
                if (!acc[slot.court_id.toString()]) {
                    acc[slot.court_id.toString()] = [];
                }
                acc[slot.court_id.toString()].push({
                    startTime: slot.start_time,
                    endTime: slot.end_time,
                });
            });
            return acc;
        },
        {} as { [key: string]: { startTime: string; endTime: string }[] },
    );

    const priceTableQuery = usePriceTablesByLocationQuery({ locationId });
    const courtsByLocationQuery = useCourtsByLocationQuery({ locationId });
    const courts = courtsByLocationQuery.data?.data?.data || [];
    const [cellWidth, setCellWidth] = useState(0);
    const [courtCellWidth, setCourtCellWidth] = useState(0);
    const router = useRouter();
    const { selectedCells, setSelectedCells } = useBookingStore();

    const generateTimeSlots = (start: string, end: string, intervalMinutes: number) => {
        const slots = [];
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);

        let currentHour = startHour;
        let currentMinute = startMinute;

        while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
            // Format the time to HH:mm
            const formattedTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            slots.push(formattedTime);

            // Add interval
            currentMinute += intervalMinutes;

            // Handle hour overflow
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute = currentMinute % 60;
            }
        }

        return slots;
    };

    const timeRange = getTimeRange(priceTableQuery.data?.data?.data || []);

    const timeSlots = generateTimeSlots(
        timeRange.earliestStartTime,
        timeRange.latestEndTime,
        locationQuery.data?.data?.data?.min_shift_time || 30,
    );

    const cellCount = timeSlots.length - 1;

    const handleCellPress = useCallback(
        (courtId: number, timeSlotIndex: number) => {
            const startTime = timeSlots[timeSlotIndex];
            const endTime = timeSlots[timeSlotIndex + 1] || timeRange.latestEndTime;

            // Get current cells from the store
            const currentCells = useBookingStore.getState().selectedCells;

            const existingIndex = currentCells.findIndex(
                (cell: SelectedCell) =>
                    cell.courtId === courtId && cell.startTime === startTime && cell.endTime === endTime,
            );

            if (existingIndex >= 0) {
                // Remove the cell if it exists
                const newCells = currentCells.filter((_, idx: number) => idx !== existingIndex);
                useBookingStore.getState().setSelectedCells(newCells);
            } else {
                // Add new cell if it doesn't exist
                const courtData = courts.find((court) => court.id === courtId);
                const newCell: SelectedCell = {
                    courtId,
                    startTime,
                    endTime,
                    courtData,
                };
                useBookingStore.getState().setSelectedCells([...currentCells, newCell]);
            }
        },
        [timeSlots, timeRange.latestEndTime],
    );

    const handleRegister = () => {
        // TODO: Implement registration logic
        if (selectedCells.length === 0) {
            Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một khung giờ để đăng ký');
            return;
        }
        Alert.alert('Đăng ký', 'Bạn có chắc chắn muốn đăng ký các khung giờ đã chọn?', [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Đồng ý',
                onPress: () => {
                    router.push(`/booking/${locationId}/confirm`);
                },
            },
        ]);
    };

    const isCellBooked = (courtId: number, timeSlotIndex: number) => {
        const startTime = timeSlots[timeSlotIndex];
        const endTime = timeSlots[timeSlotIndex + 1] || timeRange.latestEndTime;

        return (
            bookedSlots?.[courtId] &&
            bookedSlots[courtId].some((slot) => slot.startTime === startTime && slot.endTime === endTime)
        );
    };

    const isCellSelected = (courtId: number, timeSlotIndex: number) => {
        const startTime = timeSlots[timeSlotIndex];
        const endTime = timeSlots[timeSlotIndex + 1] || timeRange.latestEndTime;

        return selectedCells.some(
            (cell) => cell.courtId === courtId && cell.startTime === startTime && cell.endTime === endTime,
        );
    };

    const renderRow = (court: ICourt) => {
        const bookedState = states.find((state) => state.id === 'booked');

        return Array.from({ length: cellCount }, (_, timeSlotIndex) => {
            const isSelected = isCellSelected(court.id, timeSlotIndex);
            const isBooked = isCellBooked(court.id, timeSlotIndex);
            const isDateInPast = isPastDate(bookingDate, timeSlots[timeSlotIndex]);
            const isDisabled = isDateInPast || isBooked;

            return (
                <TouchableOpacity
                    key={timeSlotIndex}
                    style={[
                        styles.cell,
                        {
                            width: cellWidth,
                            height: cellWidth,
                            ...(isBooked
                                ? {
                                      backgroundColor: bookedState?.color,
                                      borderColor: bookedState?.borderColor,
                                  }
                                : isDateInPast
                                  ? {
                                        backgroundColor: bookedState?.color,
                                        borderColor: bookedState?.borderColor,
                                    }
                                  : {
                                        backgroundColor: '#ffffff',
                                        borderColor: '#e0e0e0',
                                    }),
                            opacity: isDateInPast ? 0.7 : 1,
                        },
                        isSelected && styles.selectedCell,
                        isDisabled &&
                            !isBooked && {
                                backgroundColor: '#9E9E9E',
                                borderColor: '#9E9E9E',
                            },
                    ]}
                    onPress={() => !isDisabled && handleCellPress(court.id, timeSlotIndex)}
                    disabled={isDisabled}
                />
            );
        });
    };

    const renderSheet = () => {
        if (!courts.length) return null;

        return (
            <>
                {courts.map((court) => (
                    <View key={court.id} style={[styles.sheetContainer, { paddingLeft: courtCellWidth }]}>
                        {renderRow(court)}
                    </View>
                ))}
            </>
        );
    };

    const renderCourtList = () => {
        if (!courts.length) return null;

        return (
            <View style={styles.courtList}>
                {courts.map((court, index) => (
                    <View
                        onLayout={(e) => {
                            const width = e.nativeEvent.layout.width;
                            setCourtCellWidth(width);
                        }}
                        key={court.id}
                        style={[styles.courtCell, { height: cellWidth, minWidth: courtCellWidth }]}
                    >
                        <Text>{court.name || index + 1}</Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <>
            <View style={styles.sheetWrapper}>
                <ScrollView horizontal style={styles.container} stickyHeaderIndices={[0]}>
                    <View style={styles.wrapper}>
                        <View style={[styles.timeContainer, { paddingLeft: courtCellWidth }]}>
                            {timeSlots.map((time, index) => (
                                <View
                                    onLayout={(e) => {
                                        const width = e.nativeEvent.layout.width;
                                        setCellWidth(width);
                                    }}
                                    key={index}
                                    style={styles.timeSlot}
                                >
                                    <Text>{time}</Text>
                                    <View style={styles.indicator} />
                                </View>
                            ))}
                        </View>
                        {renderSheet()}
                    </View>
                </ScrollView>
                <View style={styles.courtContainer}>{renderCourtList()}</View>
            </View>
            <View style={styles.registerButtonContainer}>
                <AppButton
                    title="Đăng ký"
                    onPress={handleRegister}
                    backgroundColor="#EF9651"
                    variant="primary"
                    styles={{
                        height: 50,
                    }}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    registerButtonContainer: {
        width: '100%',
        paddingHorizontal: 24,
    },
    sheetWrapper: {
        position: 'relative',
    },
    courtContainer: {
        position: 'absolute',
        top: 40,
        left: 0,
    },
    courtList: {
        display: 'flex',
        flexDirection: 'column',
    },
    courtCell: {
        backgroundColor: '#6cb318',
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    container: {
        minHeight: '80%',
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
    },
    timeContainer: {
        display: 'flex',
        flexDirection: 'row',
        maxHeight: 40,
        alignItems: 'center',
        backgroundColor: '#63a1f2',
    },
    sheetContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    cell: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    timeSlot: {
        paddingVertical: 12,
        width: 48,
        position: 'relative',
        fontSize: 10,
    },
    indicator: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: 12,
        borderRightWidth: 2,
        borderRightColor: '#e87a05',
    },
    selectedCell: {
        backgroundColor: '#a8e6cf',
        borderColor: '#4CAF50',
        borderWidth: 2,
    },

    registerButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        elevation: 3,
    },
    registerButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default BookingSheet;
