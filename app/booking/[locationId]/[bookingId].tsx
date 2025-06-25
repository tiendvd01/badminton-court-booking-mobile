import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useLocationByIdQuery } from '@/repository/courtRepository';
import { formatVietnameseDate } from '@/utils/dateUtils';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AppButton from '@/components/ui/AppButton';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { useMutation } from '@tanstack/react-query';

declare module 'expo-sharing' {
    export interface Sharing {
        shareAsync(uri: string): Promise<void>;
    }
}

import { useBookingByIdQuery } from '@/repository/bookingRepository';
import { useOwnerPaymentsByOwnerIdQuery } from '@/repository/paymentRepository';
import { useConfirmBookingMutation } from '@/repository/bookingRepository';
import { useUploadImageMutation } from '@/repository/uploadRepository';
import { Loader } from 'lucide-react-native';

interface Slot {
    court_id: number;
    start_time: string;
    end_time: string;
}

interface CourtSlots {
    [key: number]: { slots: Slot[] };
}

function PaymentScreen() {
    const { locationId } = useLocalSearchParams();
    const [timeLeft, setTimeLeft] = useState(0);
    const [paymentImage, setPaymentImage] = useState<string | null>(null);

    const { bookingId } = useLocalSearchParams();
    const bookingByIdQuery = useBookingByIdQuery({ bookingId: Number(bookingId) });
    const booking = bookingByIdQuery.data?.data?.data;

    const locationQuery = useLocationByIdQuery({ locationId: Number(locationId) });
    const location = locationQuery.data?.data?.data;

    const ownerPaymentsQuery = useOwnerPaymentsByOwnerIdQuery({ id: Number(location?.owner_id), isActive: true });
    const ownerPayments = ownerPaymentsQuery.data?.data?.data;

    const confirmBookingMutation = useConfirmBookingMutation();
    const uploadImageMutation = useUploadImageMutation();

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

    // Countdown timer based on booking created_at
    useEffect(() => {
        if (!booking?.created_at) return;

        const calculateTimeLeft = () => {
            const bookingTime = new Date(booking.created_at).getTime();
            const expirationTime = bookingTime + (5 * 60 * 1000); // 5 minutes from booking time
            const now = new Date().getTime();
            const remaining = Math.max(0, Math.floor((expirationTime - now) / 1000));
            return remaining;
        };

        // Set initial time
        setTimeLeft(calculateTimeLeft());

        // Update timer every second
        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);
            if (remaining <= 0) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [booking?.created_at]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const copyToClipboard = async (text: string) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Đã sao chép', 'Số tài khoản đã được sao chép');
    };

    const downloadQRCodeMutation = useMutation({
        mutationFn: async () => {
            if (!ownerPayments?.[0]?.bank_info.bin || !ownerPayments?.[0]?.payment_number || !booking?.total_price) {
                throw new Error('Không thể tải QR code');
            }

            const qrCodeUrl = `https://img.vietqr.io/image/${ownerPayments?.[0]?.bank_info.bin}-${ownerPayments?.[0]?.payment_number}-qr_only.png?amount=${booking?.total_price}`;

            const response = await fetch(qrCodeUrl);
            if (!response.ok) {
                throw new Error('Không thể tải QR code');
            }

            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);

            return new Promise((resolve, reject) => {
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    Sharing.shareAsync(base64String);
                    resolve(base64String);
                };
                reader.onerror = reject;
            });
        },
        onError: (error) => {
            Alert.alert('Lỗi', error instanceof Error ? error.message : 'Không thể tải QR code. Vui lòng thử lại.');
            console.error('Download QR code error:', error);
        },
        onSuccess: () => {
            Alert.alert('Thành công', 'QR code đã được chia sẻ thành công');
        }
    });

    const handleDownloadQRCode = () => {
        downloadQRCodeMutation.mutate();
    };


    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Cần quyền truy cập thư viện ảnh');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                base64: true,
            });

            if (!result.canceled && result.assets[0]) {
                const uri = result.assets[0].uri;
                const filename = uri.split('/').pop() || `upload_${Date.now()}.jpg`;
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image';
                
                const formData = new FormData();
                formData.append('image', {
                    uri: uri,
                    name: filename,
                    type: type,
                } as any);
                
                uploadImageMutation.mutate(formData, {
                    onSuccess: (data) => {
                        setPaymentImage(data.data.url);
                    },
                    onError: (error) => {
                        console.error('Error uploading image:', error);
                        Alert.alert('Lỗi', 'Không thể tải ảnh lên');
                    },
                });
                
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Lỗi', 'Không thể tải ảnh lên');
        }
    };

    const handleConfirm = () => {
        if (!paymentImage) {
            Alert.alert('Lỗi', 'Vui lòng tải lên ảnh chuyển khoản');
            return;
        }

        confirmBookingMutation.mutate({
            bookingId: Number(bookingId),
            paymentImageUrl: paymentImage,
        }, {
            onSuccess: () => {
                Alert.alert('Thành công', 'Đã xác nhận thanh toán');
                router.push(`/history/${bookingId}`);
            },
            onError: (error) => {
                Alert.alert('Lỗi', error instanceof Error ? error.message : 'Không thể xác nhận thanh toán. Vui lòng thử lại.');
                console.error('Confirm booking error:', error);
            },
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <IconSymbol name="arrow.left" color="#FFFFFF" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thanh toán</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Booking Info */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <IconSymbol name="info.circle" color="#c6f04a" size={20} />
                        <Text style={styles.sectionTitle}>Thông tin đặt sân</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Họ tên:</Text>
                        <Text style={styles.infoValue}>{booking?.customer_info.name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Số điện thoại:</Text>
                        <Text style={styles.infoValue}>{booking?.customer_info.phone_number}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mã đơn hàng:</Text>
                        <Text style={styles.infoValue}>#{booking?.booking_code}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ngày đặt:</Text>
                        <Text style={styles.infoValue}>{formatVietnameseDate(new Date(booking?.booking_date ?? ''))}</Text>
                    </View>

                    {/* Detailed Slots Section */}
                    <View style={[styles.section, { marginTop: 12 }]}>
                        <View style={styles.sectionHeader}>
                            <IconSymbol name="calendar" color="#c6f04a" size={20} />
                            <Text style={styles.sectionTitle}>Chi tiết lịch đặt</Text>
                        </View>

                        {Object.entries(booking?.slots?.reduce((acc, slot: Slot) => {
                            acc[slot.court_id] = acc[slot.court_id] || { slots: [] };
                            acc[slot.court_id].slots.push(slot);
                            return acc;
                        }, {} as CourtSlots) || []).map(([courtId, slots], idx) => (
                            <View key={courtId} style={{ marginBottom: 16 }}>
                                <Text style={[styles.infoLabel, { fontWeight: 'bold', marginBottom: 8 }]}>
                                    Sân {courtId}
                                </Text>
                                {slots.slots.map((slot: Slot) => (
                                    <Text key={slot.start_time} style={[styles.infoValue, { marginLeft: 8, marginBottom: 4 }]}>
                                        • {slot.start_time} - {slot.end_time}
                                    </Text>
                                ))}
                            </View>
                        ))}

                        <View style={[styles.infoRow, { marginTop: 8 }]}>
                            <Text style={[styles.infoLabel, { fontWeight: 'bold' }]}>
                                Tổng giờ: {calculateTotalHours().toFixed(1)} giờ
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.infoRow, { marginTop: 8 }]}>
                        <Text style={[styles.infoLabel, { fontWeight: 'bold' }]}>
                            Tổng tiền:
                        </Text>
                        <Text style={[styles.infoValue, { color: '#c6f04a', fontWeight: 'bold' }]}>
                            {booking?.total_price.toLocaleString('vi-VN')} VNĐ
                        </Text>
                    </View>
                    <View style={[styles.infoRow, { marginTop: 4 }]}>
                        <Text style={styles.infoLabel}>Số tiền thanh toán:</Text>
                        <Text style={[styles.infoValue, { color: '#c6f04a', fontWeight: 'bold' }]}>
                            {booking?.total_price.toLocaleString('vi-VN')} VNĐ
                        </Text>
                    </View>
                </View>

                {/* Bank Transfer Info */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <IconSymbol name="creditcard" color="#c6f04a" size={20} />
                        <Text style={styles.sectionTitle}>Chuyển khoản ngân hàng</Text>
                    </View>

                    {
                        ownerPayments?.length ? (
                            <View style={styles.bankInfoContainer}>
                                <View style={styles.bankInfoRow}>
                                    <Text style={styles.bankLabel}>Chủ tài khoản:</Text>
                                    <Text style={styles.bankValue}>{ownerPayments?.[0]?.account_name}</Text>
                                </View>
                                <View style={styles.bankInfoRow}>
                                    <Text style={styles.bankLabel}>Ngân hàng:</Text>
                                    <Text style={styles.bankValue}>{ownerPayments?.[0]?.bank_info.shortName}</Text>
                                </View>
                                <View style={styles.bankInfoRow}>
                                    <Text style={styles.bankLabel}>Số tài khoản:</Text>
                                    <View style={styles.bankAccountContainer}>
                                        <Text style={styles.bankValue}>{ownerPayments?.[0]?.payment_number}</Text>
                                        <TouchableOpacity
                                            style={styles.copyButton}
                                            onPress={() => copyToClipboard(ownerPayments?.[0]?.payment_number ?? '')}
                                        >
                                            <IconSymbol name="clipboard" color="#c6f04a" size={16} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={styles.qrCodeContainer}
                                    onPress={handleDownloadQRCode}
                                    disabled={downloadQRCodeMutation.isPending}
                                >
                                    {downloadQRCodeMutation.isPending && (
                                        <View style={styles.loadingOverlay}>
                                            <Loader size={24} color="#c6f04a" />
                                        </View>
                                    )}
                                    <View style={styles.qrCodePlaceholder}>
                                        <Image
                                            source={{
                                                uri: `https://img.vietqr.io/image/${ownerPayments?.[0]?.bank_info.bin}-${ownerPayments?.[0]?.payment_number}-qr_only.png?amount=${booking?.total_price}`,
                                            }}
                                            style={styles.qrCodeImage}
                                            resizeMode="contain"
                                        />
                                        <View style={styles.downloadOverlay}>
                                            <IconSymbol name="square.and.arrow.down" color="#c6f04a" size={24} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.bankInfoContainer}>
                                <Text style={styles.bankValue}>Không có thông tin ngân hàng</Text>
                            </View>
                        )
                    }

                    <View style={styles.noteContainer}>
                        <Text style={styles.noteText}>
                            Vui lòng chuyển khoản chính xác số tiền {booking?.total_price.toLocaleString('vi-VN')} VNĐ để hoàn tất đặt sân.
                        </Text>
                    </View>
                </View>

                {/* Time Limit */}
                <View style={[styles.section, { borderColor: timeLeft < 300 ? '#ff4444' : '#c6f04a' }]}>
                    <View style={styles.timerContainer}>
                        <IconSymbol
                            name="clock"
                            color={timeLeft < 300 ? '#ff4444' : '#c6f04a'}
                            size={24}
                        />
                        <Text style={[styles.timerText, { color: timeLeft < 300 ? '#ff4444' : '#c6f04a' }]}>
                            Đơn hàng sẽ bị hủy sau: {formatTime(timeLeft)}
                        </Text>
                    </View>
                </View>

                {/* Upload Payment Proof */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Tải lên ảnh chuyển khoản</Text>
                    <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={pickImage}
                    >
                        {paymentImage ? (
                            <Image
                                source={{ uri: paymentImage }}
                                style={styles.uploadedImage}
                                resizeMode="contain"
                                resizeMethod="resize"
                            />
                        ) : (
                            <View style={styles.uploadPlaceholder}>
                                <IconSymbol name="camera" size={32} color="#999" />
                                <Text style={styles.uploadText}>Chạm để tải ảnh lên</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Confirm Button */}
            <View style={styles.footer}>
                <AppButton
                    title="XÁC NHẬN ĐẶT"
                    onPress={handleConfirm}
                    color="#000000"
                    backgroundColor="#EF9651"
                    styles={styles.confirmButton}
                    variant='primary'
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    downloadOverlay: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 8,
        padding: 8,
    },
    container: {
        flex: 1,
        backgroundColor: '#2E7D32',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    section: {
        backgroundColor: '#064710',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        color: '#c6f04a',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    infoLabel: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    infoValue: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    bankInfoContainer: {
        marginTop: 8,
    },
    bankInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    bankLabel: {
        color: '#FFFFFF',
        fontSize: 14,
        width: 120,
    },
    bankValue: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    bankAccountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    copyButton: {
        marginLeft: 8,
        padding: 4,
    },
    qrCodeContainer: {
        alignItems: 'center',
        marginVertical: 16,
    },
    qrCodePlaceholder: {
        width: 160,
        height: 160,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#064710',
    },
    qrCodeImage: {
        width: '100%',
        height: '100%',
    },

    qrCodeText: {
        color: '#c6f04a',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
    },
    noteContainer: {
        backgroundColor: 'rgba(198, 240, 74, 0.1)',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    noteText: {
        color: '#c6f04a',
        fontSize: 12,
        lineHeight: 16,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
    },
    timerText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    uploadButton: {
        height: 200,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderStyle: 'dashed',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadPlaceholder: {
        alignItems: 'center',
    },
    uploadText: {
        color: '#999',
        marginTop: 8,
        fontSize: 12,
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    confirmButton: {
        height: 50,
        borderRadius: 8,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 8,
    },
});

export default PaymentScreen;