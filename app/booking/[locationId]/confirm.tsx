import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useBookingStore } from '@/stores/bookingStore';
import { useLocalSearchParams } from 'expo-router';
import { useLocationByIdQuery } from '@/repository/courtRepository';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { formatVietnameseDate } from '@/utils/dateUtils';
import { Controller, useForm } from 'react-hook-form';
import AppButton from '@/components/ui/AppButton';
import { useCreateBookingMutation } from '@/repository/bookingRepository';

type FormData = {
    name: string;
    phone: string;
    notes: string;
};

function ConfirmScreen() {
    const { selectedCells, bookingDate, setBookingInfo } = useBookingStore();
    const { locationId } = useLocalSearchParams();
    const createBookingMutation = useCreateBookingMutation();
    const locationQuery = useLocationByIdQuery({ locationId: Number(locationId) });
    const location = locationQuery.data?.data?.data;

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            name: '',
            phone: '',
            notes: '',
        },
    });

    const onSubmit = (data: FormData) => {
        setBookingInfo({
            name: data.name,
            phone: data.phone,
            notes: data.notes,
        });
        createBookingMutation.mutate({
            slots: selectedCells.map((item) => ({
                courtId: item.courtId,
                startTime: item.startTime,
                endTime: item.endTime,
            })),
            locationId: Number(locationId),
            customer_info: {
                name: data.name,
                phone_number: data.phone,
            },
            booking_date: bookingDate,
            note: data.notes,
        }, {
            onSuccess: (data) => {
                router.push(`/booking/${locationId}/${data.data.data.id}`);
            },
            onError: () => {
                Alert.alert('Lỗi', "Có lỗi xảy ra");
            },
        })
    }; 
    
    const phoneRegex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-9])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Xác nhận thông tin đặt lịch</Text>
            </View>

            <ScrollView>
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
                        <Text style={styles.infoContentText}>Ngày: {formatVietnameseDate(bookingDate)}</Text>

                        {Object.entries(
                            selectedCells.reduce(
                                (
                                    acc: {
                                        [key: number]: {
                                            court: any;
                                            slots: Array<{ startTime: string; endTime: string; price: number }>;
                                        };
                                    },
                                    cell,
                                ) => {
                                    const [startHours, startMinutes] = cell.startTime.split(':').map(Number);
                                    const [endHours, endMinutes] = cell.endTime.split(':').map(Number);

                                    // Calculate duration in hours
                                    const startDate = new Date();
                                    startDate.setHours(startHours, startMinutes, 0, 0);
                                    const endDate = new Date();
                                    endDate.setHours(endHours, endMinutes, 0, 0);
                                    const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

                                    // Find price for this slot
                                    const price =
                                        cell.courtData?.priceTable?.prices?.find((item: any) => {
                                            const [itemStartHours, itemStartMinutes] = item.start_time
                                                .split(':')
                                                .map(Number);
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
                                            slots: [],
                                        };
                                    }

                                    acc[cell.courtId].slots.push({
                                        startTime: cell.startTime,
                                        endTime: cell.endTime,
                                        price: slotPrice,
                                    });

                                    return acc;
                                },
                                {},
                            ),
                        ).map(([courtId, { court, slots }]) => (
                            <View key={courtId} style={{ marginBottom: 16 }}>
                                <Text style={[styles.infoContentText, { fontWeight: 'bold' }]}>{court?.name}</Text>
                                {slots.map((slot, idx) => (
                                    <Text key={idx} style={[styles.infoContentText, { marginLeft: 8 }]}>
                                        • {slot.startTime} - {slot.endTime}
                                    </Text>
                                ))}
                                <Text style={[styles.infoContentText, { color: '#c6f04a', marginTop: 4 }]}>
                                    Thành tiền:{' '}
                                    {slots.reduce((sum, slot) => sum + slot.price, 0).toLocaleString('vi-VN')} VNĐ
                                </Text>
                            </View>
                        ))}

                        <Text style={[styles.infoContentText, { color: '#c6f04a', fontWeight: 'bold' }]}>
                            Tổng giờ:{' '}
                            {selectedCells
                                .reduce((total, cell) => {
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
                                }, 0)
                                .toFixed(1)}{' '}
                            giờ
                        </Text>

                        <Text style={[styles.infoContentText, { color: '#c6f04a', fontWeight: 'bold' }]}>
                            Tổng tiền:{' '}
                            {selectedCells
                                .reduce((total, cell) => {
                                    const [startHours, startMinutes] = cell.startTime.split(':').map(Number);
                                    const [endHours, endMinutes] = cell.endTime.split(':').map(Number);

                                    // Calculate duration in hours
                                    const startDate = new Date();
                                    startDate.setHours(startHours, startMinutes, 0, 0);

                                    const endDate = new Date();
                                    endDate.setHours(endHours, endMinutes, 0, 0);

                                    const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

                                    // Find matching price for the time slot
                                    const price =
                                        cell.courtData?.priceTable?.prices?.find((item: any) => {
                                            const [itemStartHours, itemStartMinutes] = item.start_time
                                                .split(':')
                                                .map(Number);
                                            const [itemEndHours, itemEndMinutes] = item.end_time.split(':').map(Number);

                                            const priceStart = new Date().setHours(itemStartHours, itemStartMinutes);
                                            const priceEnd = new Date().setHours(itemEndHours, itemEndMinutes);
                                            const slotStart = new Date().setHours(startHours, startMinutes);
                                            const slotEnd = new Date().setHours(endHours, endMinutes);

                                            // Check if the booking slot is within the price time range
                                            return slotStart >= priceStart && slotEnd <= priceEnd;
                                        })?.price || 0;

                                    // Calculate price for this slot (price per hour * duration)
                                    return total + price * durationHours;
                                }, 0)
                                .toLocaleString('vi-VN')}{' '}
                            VNĐ
                        </Text>
                    </View>
                </View>

                {/* Booking Form */}
                <View style={styles.infoWrapper}>
                    <View style={styles.infoTitle}>
                        <IconSymbol name="person.fill" color="#c6f04a" />
                        <Text style={styles.infoTitleText}>Thông tin người đặt</Text>
                    </View>
                    <View style={styles.formContent}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>TÊN CỦA BẠN</Text>
                            <Controller
                                control={control}
                                rules={{
                                    required: 'Vui lòng nhập tên của bạn',
                                    minLength: {
                                        value: 2,
                                        message: 'Tên phải có ít nhất 2 ký tự',
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                errors.name && styles.inputError,
                                            ]}
                                            placeholder="Nhập tên của bạn"
                                            placeholderTextColor="#999"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                        {errors.name && (
                                            <Text style={styles.errorText}>{errors.name.message}</Text>
                                        )}
                                    </>
                                )}
                                name="name"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>SỐ ĐIỆN THOẠI</Text>
                            <View>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: 'Vui lòng nhập số điện thoại',
                                        pattern: {
                                            value: phoneRegex,
                                            message: 'Số điện thoại không hợp lệ',
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <>
                                            <TextInput
                                                style={[
                                                    styles.input,
                                                    errors.phone && styles.inputError,
                                                ]}
                                                placeholder="Nhập số điện thoại"
                                                placeholderTextColor="#999"
                                                keyboardType="phone-pad"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                            {errors.phone && (
                                                <Text style={styles.errorText}>{errors.phone.message}</Text>
                                            )}
                                        </>
                                    )}
                                    name="phone"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>GHI CHÚ CHO CHỦ SÂN (Tùy chọn)</Text>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={[styles.input, styles.notesInput]}
                                        placeholder="Nhập ghi chú"
                                        placeholderTextColor="#999"
                                        multiline
                                        numberOfLines={3}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                                name="notes"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                {/* Submit Button */}
                <AppButton
                    title="ĐẶT SÂN NGAY"
                    onPress={handleSubmit(onSubmit)}
                    color="#000"
                    backgroundColor="#EF9651"
                    styles={{
                        height: 50,
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginHorizontal: 10,
                        marginTop: 10,
                    }}
                    variant='primary'
                />
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
        backgroundColor: '#064710',
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
        color: '#c6f04a',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoContent: {
        marginTop: 8,
        gap: 16,
    },
    infoContentText: {
        color: '#FFFFFF',
        fontSize: 14,
        marginBottom: 4,
    },
    formContent: {
        marginTop: 8,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        color: '#FFFFFF',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        color: '#000000',
        fontSize: 16,
        width: "100%"
    },
    phoneInput: {
        flex: 1,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
    notesInput: {
        textAlignVertical: 'top',
        minHeight: 100,
    },
    submitButton: {
        backgroundColor: '#c6f04a',
        borderRadius: 8,
        padding: 16,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputError: {
        borderWidth: 1,
        borderColor: '#ff4444',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginTop: 4,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
});

export default ConfirmScreen;
