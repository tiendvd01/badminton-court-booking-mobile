import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useBookingByIdQuery, useCancelBookingMutation } from '@/repository/bookingRepository';
import { getCourtById, useCourtByIdQuery } from '@/repository/courtRepository';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useQueries, useMutation, useQueryClient } from '@tanstack/react-query';

interface Slot {
    court_id: number;
    start_time: string;
    end_time: string;
}

interface CourtSlots {
    [key: number]: { slots: Slot[] };
}

const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
};

const getStatusText = (status?: string) => {
    switch (status) {
        case 'pending':
            return 'Chờ thanh toán';
        case 'confirmed':
            return 'Đã xác nhận';
        case 'cancelled':
            return 'Đã hủy';
        case 'completed':
            return 'Hoàn thành';
        default:
            return 'Không xác định';
    }
};

const getStatusColor = (status?: string) => {
    switch (status) {
        case 'pending':
            return '#FFA000';
        case 'confirmed':
            return '#2196F3';
        case 'cancelled':
            return '#F44336';
        case 'completed':
            return '#4CAF50';
        default:
            return '#9E9E9E';
    }
};

const History = () => {
    const { bookingId } = useLocalSearchParams();
    const queryClient = useQueryClient();
    const bookingQuery = useBookingByIdQuery({ bookingId: Number(bookingId) });
    const booking = bookingQuery.data?.data?.data;
    const courtQueries = useQueries({
        queries:
            // Remove duplicate court_id before mapping
            [...new Set(booking?.slots?.map(slot => slot.court_id))]?.map((courtId) => ({
                queryKey: ['court', courtId],
                queryFn: () => getCourtById({ courtId }),
            })) || [],
    });

    const location = courtQueries[0]?.data?.data?.data?.location;

    const handleBack = () => {
        router.push("/(tabs)");
    };

    const handleNavigateToPayment = () => {
        if (location?.id) {
            router.push(`/booking/${location.id}/${bookingId}`);
        }
    };

    const cancelBookingMutation = useCancelBookingMutation();

    const handleCancelBooking = () => {
        cancelBookingMutation.mutate(
            { bookingId: Number(bookingId) },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
                    router.back();
                },
                onError: (error) => {
                    console.error('Failed to cancel booking:', error);
                    // You might want to show an error toast here
                },
            }
        );
    };

    // Calculate total hours
    const calculateTotalHours = () => {
        return booking?.slots?.reduce((total, slot: Slot) => {
            const [startHours, startMinutes] = slot.start_time.split(':').map(Number);
            const [endHours, endMinutes] = slot.end_time.split(':').map(Number);

            const startDate = new Date();
            startDate.setHours(startHours, startMinutes, 0, 0);

            const endDate = new Date();
            endDate.setHours(endHours, endMinutes, 0, 0);

            return total + ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
        }, 0) || 0;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <IconSymbol name="arrow.left" color="#FFFFFF" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết lịch đặt</Text>
            </View>

            <ScrollView style={styles.scrollContainer}>
                <View style={styles.infoCard}>
                    <View style={styles.avatarWrapper}>
                        <Image source={require('@/assets/images/cat.png')} style={styles.avatar} />
                        <View style={styles.customerInfo}>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Tên KH: </Text>
                                <Text style={styles.value}>{booking?.customer_info?.name || 'Chưa cập nhật'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>SĐT: </Text>
                                <Text style={styles.value}>
                                    {booking?.customer_info?.phone_number || 'Chưa cập nhật'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.sectionTitleWrapper}>
                        <IconSymbol name="clipboard.fill" color="#FFD700" size={20} />
                        <Text style={styles.sectionTitle}>Thông tin đặt lịch</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Mã lịch đặt:</Text>
                        <Text style={styles.infoValue}>{booking?.booking_code || 'N/A'}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Tên cụm sân:</Text>
                        <Text style={styles.infoValue}>{location?.name || 'N/A'}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Địa chỉ:</Text>
                        <Text style={styles.infoValue}>{location?.address || 'N/A'}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <View>
                            {Object.entries(
                                booking?.slots?.reduce((acc, slot: Slot) => {
                                    acc[slot.court_id] = acc[slot.court_id] || { slots: [] };
                                    acc[slot.court_id].slots.push(slot);
                                    return acc;
                                }, {} as CourtSlots) || [],
                            ).map(([courtId, slots], idx) => (
                                <View key={courtId} style={{ marginBottom: 16 }}>
                                    <Text style={[styles.infoLabel, { fontWeight: 'bold', marginBottom: 8 }]}>
                                        Sân {courtId}
                                    </Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {slots.slots.map((slot: Slot) => (
                                            <View
                                                key={slot.start_time}
                                                style={{
                                                    backgroundColor: '#0f3d1a',
                                                    borderRadius: 8,
                                                    padding: 8,
                                                    marginBottom: 8,
                                                    marginRight: 8,
                                                }}
                                            >
                                                <Text style={styles.infoValue}>
                                                    {slot.start_time} - {slot.end_time}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Tổng giờ: </Text>
                        <Text style={styles.infoValue}>{calculateTotalHours()}h</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Ngày đặt: </Text>
                        <Text style={styles.infoValue}>
                            {booking?.booking_date ? new Date(booking.booking_date).toLocaleDateString('vi-VN') : 'N/A'}
                        </Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Trạng thái:</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking?.status) }]}>
                            <Text style={styles.statusText}>{getStatusText(booking?.status)}</Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Tổng tiền:</Text>
                        <Text style={[styles.infoValue, styles.priceText]}>
                            {booking?.total_price ? `${booking.total_price.toLocaleString('vi-VN')}  ` : 'N/A'}đ
                        </Text>
                    </View>
                </View>

                {
                    booking?.payment_image && (
                        <View style={styles.infoCard}>
                            <View style={styles.sectionTitleWrapper}>
                                <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
                            </View>
                            <Image source={{ uri: booking.payment_image }} style={styles.paymentImage} />
                        </View>
                    )
                }

                <View style={styles.infoCard}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Ghi chú:</Text>
                        <Text style={styles.infoValue}>{booking?.note || 'Không có'}</Text>
                    </View>
                </View>
            </ScrollView>
            {booking?.status === 'pending' && (
                <View style={styles.footer}>
                    <TouchableOpacity 
                        style={[styles.footerButton, styles.cancelButton]}
                        onPress={handleCancelBooking}
                        disabled={cancelBookingMutation.isPending}
                    >
                        <Text style={styles.footerButtonText}>
                            {cancelBookingMutation.isPending ? 'Đang xử lý...' : 'Hủy đơn'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.footerButton, styles.payButton]}
                        onPress={handleNavigateToPayment}
                    >
                        <Text style={styles.footerButtonText}>Thanh toán</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2E7D32',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    retryText: {
        color: '#007AFF',
        marginTop: 10,
        fontWeight: '500',
    },
    infoCard: {
        backgroundColor: '#1B5E20',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    scrollContainer: {
        flex: 1,
        padding: 8,
    },
    avatarWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    name: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    customerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        color: '#E0E0E0',
        fontSize: 14,
        minWidth: 60,
    },
    value: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    phone: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    sectionTitleWrapper: {
        flexDirection: 'row',
        gap: 4,
    },
    sectionTitle: {
        color: '#FFD700',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    infoLabel: {
        color: '#E0E0E0',
        fontSize: 14,
        width: 100,
    },
    infoValue: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 14,
    },
    timeSlotsContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    timeSlotItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    timeSlotText: {
        color: '#FFFFFF',
        fontSize: 13,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
    },
    priceText: {
        color: '#FFD700',
        fontWeight: 'bold',
    },
    paymentImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 8,
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#1B5E20',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    footerButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    cancelButton: {
        backgroundColor: '#F44336',
    },
    payButton: {
        backgroundColor: '#FFA000',
    },
    footerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default History;
