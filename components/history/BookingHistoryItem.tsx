import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useBookingByIdQuery } from '@/repository/bookingRepository';
import { useCourtByIdQuery } from '@/repository/courtRepository';
import PendingIcon from '../icons/PendingIcon';
import ConfirmedIcon from '../icons/ConfirmedIcon';
import CancelledIcon from '../icons/CancelledIcon';
import CompletedIcon from '../icons/CompletedIcon';
import ClockIcon from '../icons/ClockIcon';

interface BookingHistoryItemProps {
    bookingId: string;
    onPress?: () => void;
}

const formatVietnameseDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const BookingHistoryItem: React.FC<BookingHistoryItemProps> = ({ bookingId, onPress }) => {
    const bookingQuery = useBookingByIdQuery({ bookingId: Number(bookingId) });
    const courtQuery = useCourtByIdQuery({ courtId: Number(bookingQuery.data?.data.data.slots[0].court_id) });

    const getStatusInfo = (status: string) => {
        const statusInfo = {
            pending: {
                text: 'Chờ thanh toán',
                color: '#FFA000', // Orange for pending
                icon: PendingIcon
            },
            confirmed: {
                text: 'Đang chờ duyệt',
                color: '#1976D2', // Blue for confirmed
                icon: ConfirmedIcon
            },
            cancelled: {
                text: 'Tự động hủy do quá hạn thanh toán',
                color: '#D32F2F', // Red for cancelled
                icon: CancelledIcon
            },
            completed: {
                text: 'Đã hoàn thành',
                color: '#388E3C', // Green for completed
                icon: CompletedIcon
            }
        };

        const defaultStatus = {
            text: 'Trạng thái không xác định',
            color: '#757575', // Gray for unknown
            icon: ClockIcon
        };

        const currentStatus = statusInfo[status as keyof typeof statusInfo] || defaultStatus;
        
        return {
            ...currentStatus,
            icon: React.createElement(currentStatus.icon, { size: 16, color: currentStatus.color })
        };
    };

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.courtName} numberOfLines={1} ellipsizeMode="tail">
                    {courtQuery.data?.data.data.location?.name}
                </Text>
                <View style={styles.statusContainer}>
                    {getStatusInfo(bookingQuery.data?.data.data.status ?? '').icon}
                    <Text style={[styles.statusText, { color: getStatusInfo(bookingQuery.data?.data.data.status ?? '').color }]}>
                        {getStatusInfo(bookingQuery.data?.data.data.status ?? '').text}
                    </Text>
                </View>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.label}>Chi tiết:</Text>
                <View style={styles.slotsContainer}>
                    {Object.entries(
                        bookingQuery.data?.data.data.slots?.reduce<Record<string, any[]>>((acc, slot) => {
                            if (!acc[slot.court_id]) {
                                acc[slot.court_id] = [];
                            }
                            acc[slot.court_id].push(slot);
                            return acc;
                        }, {}) || {}
                    ).map(([courtId, slots]) => (
                        <View key={courtId} style={{ marginBottom: 4 }}>
                            <Text style={styles.detailText}>
                                Sân {courtId}:
                            </Text>
                            {slots.map((slot, idx) => (
                                <Text key={idx} style={[styles.detailText, { marginLeft: 8 }]}>
                                    • {slot.start_time} - {slot.end_time}
                                </Text>
                            ))}
                        </View>
                    ))}
                    <Text style={[styles.detailText, {marginTop: 4}]}>
                        Ngày {bookingQuery.data?.data.data.booking_date ? formatVietnameseDate(bookingQuery.data.data.data.booking_date) : ''}
                    </Text>
                </View>
            </View>

            <View style={styles.addressRow}>
                <Text style={styles.label}>Địa chỉ:</Text>
                <Text style={styles.addressText}>{courtQuery.data?.data.data.location?.address}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'column',
        marginBottom: 12,
        width: '100%',
    },
    courtName: {
        width: '100%',
        fontSize: 16,
        fontWeight: '600',
        color: '#FF6B00',
        marginBottom: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusText: {
        fontSize: 14,
        marginLeft: 8,
        fontWeight: '500',
    },
    statusIcon: {
        marginRight: 8,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#2E7D32',
        width: 70,
    },
    detailText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2E7D32',
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    addressRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    addressText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#2E7D32',
        flexWrap: 'wrap',
    },
    slotsContainer: {
        flex: 1,
        flexDirection: 'column',
    },
});

export default BookingHistoryItem;
