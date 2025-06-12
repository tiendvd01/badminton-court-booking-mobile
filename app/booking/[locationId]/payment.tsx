import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useBookingStore } from '@/stores/bookingStore';
import { useLocationByIdQuery } from '@/repository/courtRepository';
import { formatVietnameseDate } from '@/utils/dateUtils';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AppButton from '@/components/ui/AppButton';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';

function PaymentScreen() {
    const { selectedCells, bookingDate, bookingInfo } = useBookingStore();
    const { locationId } = useLocalSearchParams();
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
    const [paymentImage, setPaymentImage] = useState<string | null>(null);

    const locationQuery = useLocationByIdQuery({ locationId: Number(locationId) });
    const location = locationQuery.data?.data?.data;

    // Calculate total price
    const totalPrice = selectedCells.reduce((total, cell) => {
        const [startHours, startMinutes] = cell.startTime.split(':').map(Number);
        const [endHours, endMinutes] = cell.endTime.split(':').map(Number);
        
        const startDate = new Date();
        startDate.setHours(startHours, startMinutes, 0, 0);
        
        const endDate = new Date();
        endDate.setHours(endHours, endMinutes, 0, 0);
        
        const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
        const price = cell.courtData?.priceTable?.prices?.find((item: any) => {
            const [itemStartHours, itemStartMinutes] = item.start_time.split(':').map(Number);
            const [itemEndHours, itemEndMinutes] = item.end_time.split(':').map(Number);
            
            const priceStart = new Date().setHours(itemStartHours, itemStartMinutes);
            const priceEnd = new Date().setHours(itemEndHours, itemEndMinutes);
            const slotStart = new Date().setHours(startHours, startMinutes);
            const slotEnd = new Date().setHours(endHours, endMinutes);
            
            return slotStart >= priceStart && slotEnd <= priceEnd;
        })?.price || 0;
        
        return total + (price * durationHours);
    }, 0);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const copyToClipboard = async (text: string) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Đã sao chép', 'Số tài khoản đã được sao chép');
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Cần quyền truy cập thư viện ảnh');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPaymentImage(result.assets[0].uri);
        }
    };

    const handleConfirm = () => {
        if (!paymentImage) {
            Alert.alert('Lỗi', 'Vui lòng tải lên ảnh chuyển khoản');
            return;
        }
        // Handle payment confirmation
        router.push(`/booking/${locationId}/success`);
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
                        <Text style={styles.infoValue}>{bookingInfo.name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Số điện thoại:</Text>
                        <Text style={styles.infoValue}>{bookingInfo.phone}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mã đơn hàng:</Text>
                        <Text style={styles.infoValue}>#{Math.random().toString(36).substr(2, 8).toUpperCase()}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ngày đặt:</Text>
                        <Text style={styles.infoValue}>{formatVietnameseDate(bookingDate)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Thời gian:</Text>
                        <Text style={styles.infoValue}>
                            {selectedCells[0]?.startTime} - {selectedCells[selectedCells.length - 1]?.endTime}
                        </Text>
                    </View>
                    <View style={[styles.infoRow, { marginTop: 8 }]}>
                        <Text style={[styles.infoLabel, { fontWeight: 'bold' }]}>Tổng tiền:</Text>
                        <Text style={[styles.infoValue, { color: '#c6f04a', fontWeight: 'bold' }]}>
                            {totalPrice.toLocaleString('vi-VN')} VNĐ
                        </Text>
                    </View>
                    <View style={[styles.infoRow, { marginTop: 4 }]}>
                        <Text style={styles.infoLabel}>Số tiền thanh toán:</Text>
                        <Text style={[styles.infoValue, { color: '#c6f04a', fontWeight: 'bold' }]}>
                            {totalPrice.toLocaleString('vi-VN')} VNĐ
                        </Text>
                    </View>
                </View>

                {/* Bank Transfer Info */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <IconSymbol name="creditcard" color="#c6f04a" size={20} />
                        <Text style={styles.sectionTitle}>Chuyển khoản ngân hàng</Text>
                    </View>
                    
                    <View style={styles.bankInfoContainer}>
                        <View style={styles.bankInfoRow}>
                            <Text style={styles.bankLabel}>Ngân hàng:</Text>
                            <Text style={styles.bankValue}>MB Bank</Text>
                        </View>
                        <View style={styles.bankInfoRow}>
                            <Text style={styles.bankLabel}>Số tài khoản:</Text>
                            <View style={styles.bankAccountContainer}>
                                <Text style={styles.bankValue}>1234567890</Text>
                                <TouchableOpacity 
                                    style={styles.copyButton}
                                    onPress={() => copyToClipboard('1234567890')}
                                >
                                    <IconSymbol name="clipboard" color="#c6f04a" size={16} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.bankInfoRow}>
                            <Text style={styles.bankLabel}>Chủ tài khoản:</Text>
                            <Text style={styles.bankValue}>NGUYEN VAN A</Text>
                        </View>
                        <View style={styles.qrCodeContainer}>
                            <View style={styles.qrCodePlaceholder}>
                                <IconSymbol name="qrcode" size={80} color="#c6f04a" />
                                <Text style={styles.qrCodeText}>Quét mã QR để chuyển tiền</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.noteContainer}>
                        <Text style={styles.noteText}>
                            Vui lòng chuyển khoản chính xác số tiền {totalPrice.toLocaleString('vi-VN')} VNĐ để hoàn tất đặt sân.
                            Nội dung chuyển khoản: TENSAN SDT
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
                                resizeMode="cover"
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
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
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
        height: 160,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderStyle: 'dashed',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
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
});

export default PaymentScreen;