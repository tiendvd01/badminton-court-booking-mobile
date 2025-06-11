import { Stack, useGlobalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import DatePicker from '@/components/ui/DatePicker';
import CourtStateInfo from '@/components/bookings/CourtStateInfo';
import AppLink from '@/components/ui/AppLink';
import BookingSheet from '@/components/bookings/BookingSheet';
import { useBookingStore } from '@/stores/bookingStore';

function BookingScreen() {
    const router = useRouter();
    const { setSelectedCells, setBookingDate } = useBookingStore();

    const { locationId } = useGlobalSearchParams();
    return (
        <>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Đặt lịch ngày trực quan</Text>
                </View>
                <DatePicker onDateSelect={(date) => setBookingDate(date)} />
                <CourtStateInfo />
                <View style={styles.priceLinkContainer}>
                    <AppLink
                        textStyle={{ color: '#FFFFFF' }}
                        content="Xem chi tiết bảng giá"
                        onPress={() => router.push(`/booking/${locationId}/price`)}
                    />
                </View>
                <View style={styles.bookingSheetContainer}><BookingSheet locationId={Number(locationId)} /></View>
            </SafeAreaView>
        </>
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
    priceLinkContainer: {
        marginTop: 16,
        paddingLeft: 10,
    },
    bookingSheetContainer: {
        marginTop: 16,
    },
});

export default BookingScreen;
