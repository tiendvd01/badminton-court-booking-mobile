import { useCourtsByLocationQuery, usePriceTablesByLocationQuery } from '@/repository/courtRepository';
import { ICourt } from '@/types/common';
import { getTimeRange } from '@/utils/helper';
import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import AppButton from '../ui/AppButton';

type Props = {
    locationId: number;
};

type SelectedCell = {
    courtId: number;
    startTime: string;
    endTime: string;
    courtData?: ICourt; // Optional for future use if needed
};

function BookingSheet({ locationId }: Props) {
    const priceTableQuery = usePriceTablesByLocationQuery({ locationId });
    const courtsByLocationQuery = useCourtsByLocationQuery({ locationId });
    const courts = courtsByLocationQuery.data?.data?.data || [];
    const [cellWidth, setCellWidth] = useState(0);
    const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]);

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

    const timeSlots = generateTimeSlots(timeRange.earliestStartTime, timeRange.latestEndTime, 30);

    const cellCount = timeSlots.length - 1;

    const handleCellPress = useCallback(
        (courtId: number, timeSlotIndex: number) => {
            const startTime = timeSlots[timeSlotIndex];
            const endTime = timeSlots[timeSlotIndex + 1] || timeRange.latestEndTime;

            setSelectedCells((prev) => {
                const existingIndex = prev.findIndex(
                    (cell) => cell.courtId === courtId && cell.startTime === startTime && cell.endTime === endTime,
                );

                if (existingIndex >= 0) {
                    return prev.filter((_, idx) => idx !== existingIndex);
                } else {
                    return [
                        ...prev,
                        {
                            courtId,
                            startTime,
                            endTime,
                        },
                    ];
                }
            });
        },
        [timeSlots, timeRange.latestEndTime],
    );

    const handleRegister = () => {
        // TODO: Implement registration logic
        Alert.alert('Đăng ký', 'Bạn có chắc chắn muốn đăng ký các khung giờ đã chọn?', [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Đồng ý',
                onPress: () => {
                    // Handle registration
                    console.log(
                        'Đăng ký các khung giờ đã chọn:',
                        selectedCells.map((cell) => ({
                            courtId: cell.courtId,
                            startTime: cell.startTime,
                            endTime: cell.endTime,
                        })),
                    );
                    // Reset selection after registration
                    setSelectedCells([]);
                },
            },
        ]);
    };

    const isCellSelected = (courtId: number, timeSlotIndex: number) => {
        const startTime = timeSlots[timeSlotIndex];
        const endTime = timeSlots[timeSlotIndex + 1] || timeRange.latestEndTime;

        return selectedCells.some(
            (cell) => cell.courtId === courtId && cell.startTime === startTime && cell.endTime === endTime,
        );
    };

    const renderRow = (court: ICourt) => {
        return Array.from({ length: cellCount }, (_, timeSlotIndex) => {
            const isSelected = isCellSelected(court.id, timeSlotIndex);
            return (
                <TouchableOpacity
                    key={timeSlotIndex}
                    style={[styles.cell, { width: cellWidth, height: cellWidth }, isSelected && styles.selectedCell]}
                    onPress={() => handleCellPress(court.id, timeSlotIndex)}
                />
            );
        });
    };

    const renderSheet = () => {
        if (!courts.length) return null;

        return (
            <>
                {courts.map((court) => (
                    <View key={court.id} style={styles.sheetContainer}>
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
                    <View key={court.id} style={[styles.courtCell, { height: cellWidth }]}>
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
                        <View style={styles.timeContainer}>
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
                <AppButton title="Đăng ký" onPress={handleRegister} backgroundColor="#EF9651" variant="primary" />
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
        width: 100,
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
        paddingLeft: 100,
    },
    sheetContainer: {
        paddingHorizontal: 100,
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
