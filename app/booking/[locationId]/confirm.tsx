import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBookingStore } from '@/stores/bookingStore';
import { useLocalSearchParams } from 'expo-router';
import { useLocationByIdQuery } from '@/repository/courtRepository';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SelectedCell } from '@/components/bookings/BookingSheet';

function ConfirmScreen() {
    const { selectedCells, bookingDate } = useBookingStore();
    const { locationId } = useLocalSearchParams();

    const locationQuery = useLocationByIdQuery({ locationId: Number(locationId) });
    const location = locationQuery.data?.data?.data;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Xác nhận thông tin đặt lịch</Text>
            </View>

            <View style={styles.infoWrapper}>
                <View style={styles.infoTitle}>
                    <IconSymbol name="map.fill" color="#c6f04a" />
                    <Text style={styles.infoTitleText}>Thông tin sân</Text>
                </View>
                <View style={styles.infoContent}>
                    <Text style={styles.infoContentText}>Tên sân: {location?.name}</Text>
                    <Text style={styles.infoContentText}>Địa chỉ: {location?.address}</Text>
                    <Text style={styles.infoContentText}>Số điện thoại: {location?.owner?.phone}</Text>
                </View>
            </View>

            <View style={styles.infoWrapper}>
                <View style={styles.infoTitle}>
                    <IconSymbol name="ticket.fill" color="#c6f04a" />
                    <Text style={styles.infoTitleText}>Thông tin lịch đặt</Text>
                </View>
                <View style={styles.infoContent}>
                    <Text style={styles.infoContentText}>Ngày: {bookingDate}</Text>
                    
                    {Object.entries(
                        selectedCells.reduce((acc: {[key: number]: {court: any, slots: Array<{startTime: string, endTime: string, price: number}>}}, cell) => {
                            const [startHours, startMinutes] = cell.startTime.split(':').map(Number);
                            const [endHours, endMinutes] = cell.endTime.split(':').map(Number);
                            
                            // Calculate duration in hours
                            const startDate = new Date();
                            startDate.setHours(startHours, startMinutes, 0, 0);
                            const endDate = new Date();
                            endDate.setHours(endHours, endMinutes, 0, 0);
                            const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
                            
                            // Find price for this slot
                            const price = cell.courtData?.priceTable?.prices?.find((item: any) => {
                                const [itemStartHours, itemStartMinutes] = item.start_time.split(':').map(Number);
                                const [itemEndHours, itemEndMinutes] = item.end_time.split(':').map(Number);
                                
                                const priceStart = new Date().setHours(itemStartHours, itemStartMinutes);
                                const priceEnd = new Date().setHours(itemEndHours, itemEndMinutes);
                                const slotStart = new Date().setHours(startHours, startMinutes);
                                const slotEnd = new Date().setHours(endHours, endMinutes);
                                
                                return slotStart >= priceStart && slotEnd <= priceEnd;
                            })?.price || 0;
                            
                            const slotPrice = price * durationHours;
                            
                            if (!acc[cell.courtId]) {
                                acc[cell.courtId] = {
                                    court: cell.courtData,
                                    slots: []
                                };
                            }
                            
                            acc[cell.courtId].slots.push({
                                startTime: cell.startTime,
                                endTime: cell.endTime,
                                price: slotPrice
                            });
                            
                            return acc;
                        }, {})
                    ).map(([courtId, {court, slots}]) => (
                        <View key={courtId} style={{marginBottom: 16}}>
                            <Text style={[styles.infoContentText, {fontWeight: 'bold'}]}>{court?.name}</Text>
                            {slots.map((slot, idx) => (
                                <Text key={idx} style={[styles.infoContentText, {marginLeft: 8}]}>
                                    • {slot.startTime} - {slot.endTime}
                                </Text>
                            ))}
                            <Text style={[styles.infoContentText, {color: '#c6f04a', marginTop: 4}]}>
                                Thành tiền: {slots.reduce((sum, slot) => sum + slot.price, 0).toLocaleString('vi-VN')} VNĐ
                            </Text>
                        </View>
                    ))}

                    <Text style={[styles.infoContentText, {color: '#c6f04a', fontWeight: 'bold'}]}>
                        Tổng giờ: {
                            selectedCells.reduce((total, cell) => {
                                const [startHours, startMinutes] = cell.startTime.split(':').map(Number);
                                const [endHours, endMinutes] = cell.endTime.split(':').map(Number);
                                
                                const startDate = new Date();
                                startDate.setHours(startHours, startMinutes, 0, 0);
                                
                                const endDate = new Date();
                                endDate.setHours(endHours, endMinutes, 0, 0);
                                
                                // Calculate difference in hours
                                const diffMs = endDate.getTime() - startDate.getTime();
                                const diffHours = diffMs / (1000 * 60 * 60);
                                
                                return total + diffHours;
                            }, 0).toFixed(1)
                        } giờ
                    </Text>

                    <Text style={[styles.infoContentText, {color: '#c6f04a', fontWeight: 'bold'}]}>
                        Tổng tiền: {
                            selectedCells.reduce((total, cell) => {
                                const [startHours, startMinutes] = cell.startTime.split(':').map(Number);
                                const [endHours, endMinutes] = cell.endTime.split(':').map(Number);
                                
                                // Calculate duration in hours
                                const startDate = new Date();
                                startDate.setHours(startHours, startMinutes, 0, 0);
                                
                                const endDate = new Date();
                                endDate.setHours(endHours, endMinutes, 0, 0);
                                
                                const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
                                
                                // Find matching price for the time slot
                                const price = cell.courtData?.priceTable?.prices?.find((item: any) => {
                                    const [itemStartHours, itemStartMinutes] = item.start_time.split(':').map(Number);
                                    const [itemEndHours, itemEndMinutes] = item.end_time.split(':').map(Number);
                                    
                                    const priceStart = new Date().setHours(itemStartHours, itemStartMinutes);
                                    const priceEnd = new Date().setHours(itemEndHours, itemEndMinutes);
                                    const slotStart = new Date().setHours(startHours, startMinutes);
                                    const slotEnd = new Date().setHours(endHours, endMinutes);
                                    
                                    // Check if the booking slot is within the price time range
                                    return slotStart >= priceStart && slotEnd <= priceEnd;
                                })?.price || 0;
                                
                                // Calculate price for this slot (price per hour * duration)
                                return total + (price * durationHours);
                            }, 0).toLocaleString('vi-VN')
                        } VNĐ
                    </Text>
                </View>
            </View>

            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2E7D32',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        marginRight: 16,
    },
    backArrow: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoWrapper: {
        backgroundColor: "#064710",
        padding: 16,
        borderRadius: 8,
        margin: 8,
    },
    infoTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoTitleText: {
        color: "#c6f04a",
        fontSize: 16,
        fontWeight: "bold",
    },
    infoContent: {
        marginTop: 8,
        gap: 16,
    },
    infoContentText: {
        color: "#FFFFFF",
        fontSize: 14,
    }
});

export default ConfirmScreen;
