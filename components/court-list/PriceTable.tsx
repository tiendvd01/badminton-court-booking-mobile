import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { ThemedText } from '../ThemedText';
import { IPriceTable, IPrice } from '@/types/common';
import AppTable from '../ui/AppTable';

interface PriceTableProps {
    title?: string;
    priceData: IPriceTable;
}

const PriceTable: React.FC<PriceTableProps> = ({ priceData }) => {
    const { width } = useWindowDimensions();

    // Debug log
    console.log('PriceTable - priceData:', JSON.stringify(priceData, null, 2));

    // Format price to VND with thousand separators
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
    };

    // Get the time range string from start_time and end_time
    const getTimeRange = (startTime: string, endTime: string) => {
        return `${startTime} - ${endTime}`;
    };

    // Prepare table data
    const tableData = useMemo(() => {
        if (!priceData?.prices?.length) {
            return [];
        }
        const data = priceData.prices.map((price: IPrice) => [
            getTimeRange(price.start_time, price.end_time),
            formatPrice(price.price),
        ]);
        console.log('Processed table data:', data);
        return data;
    }, [priceData]);

    if (!tableData.length) {
        return (
            <View style={styles.noDataContainer}>
                <ThemedText>Không có dữ liệu giá</ThemedText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppTable headers={['Khung giờ', 'Giá']} data={tableData} containerStyle={styles.tableContainer} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    tableContainer: {
        overflow: 'hidden',
    },
    noDataContainer: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
    },
});

export default PriceTable;
