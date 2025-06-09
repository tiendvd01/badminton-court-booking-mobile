import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { IPriceTable, IPrice } from '@/types/common';

interface PriceTableProps {
  title?: string;
  priceData: IPriceTable;
  defaultPrice?: number;
}

const PriceTable: React.FC<PriceTableProps> = ({
  title,
  priceData,
  defaultPrice,
}) => {
  // Format price to VND with thousand separators
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  // Check if we have any prices to display
  const hasPrices = priceData?.prices && priceData.prices.length > 0;
  // Get default price from props or use the first price in the list if available
  const defaultPriceValue = defaultPrice || (hasPrices ? Math.min(...priceData.prices.map(p => p.price)) : 0);

  // Get the time range string from start_time and end_time
  const getTimeRange = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.mainTitle}>BẢNG GIÁ SÂN</ThemedText>
      
      <ThemedText style={styles.subtitle}>{title || priceData.name || 'Bảng giá'}</ThemedText>
      
      {priceData.description && (
        <ThemedText style={styles.description}>{priceData.description}</ThemedText>
      )}
      
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <ThemedText style={styles.headerText}>Bảng giá (/1 tiếng)</ThemedText>
        </View>
        
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.leftCell]}>
            <ThemedText style={[styles.cellText, styles.boldText]}>Khung giờ</ThemedText>
          </View>
          <View style={[styles.tableCell, styles.rightCell]}>
            <ThemedText style={[styles.cellText, styles.boldText]}>Giá</ThemedText>
          </View>
        </View>
        
        {/* Default price row */}
        {defaultPriceValue > 0 && (
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.leftCell, styles.borderBottom]}>
              <ThemedText style={styles.cellText}>Mặc định</ThemedText>
            </View>
            <View style={[styles.tableCell, styles.rightCell, styles.borderBottom]}>
              <ThemedText style={[styles.cellText, styles.priceText]}>
                {formatPrice(defaultPriceValue)}
              </ThemedText>
            </View>
          </View>
        )}
        
        {/* Price data rows */}
        {hasPrices ? (
          priceData.prices.map((price: IPrice, index: number) => (
            <View 
              key={`${price.start_time}-${price.end_time}-${index}`}
              style={[
                styles.tableRow,
                index === priceData.prices.length - 1 && { borderBottomWidth: 0 }
              ]}
            >
              <View style={[styles.tableCell, styles.leftCell, styles.borderBottom]}>
                <ThemedText style={styles.cellText}>
                  {getTimeRange(price.start_time, price.end_time)}
                </ThemedText>
              </View>
              <View style={[styles.tableCell, styles.rightCell, styles.borderBottom]}>
                <ThemedText style={[styles.cellText, styles.priceText]}>
                  {formatPrice(price.price)}
                </ThemedText>
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.tableRow, { justifyContent: 'center', padding: 16 }]}>
            <ThemedText style={styles.cellText}>Chưa có bảng giá</ThemedText>
          </View>
        )}
      </View>
      
      {priceData.owner && (
        <View style={styles.ownerContainer}>
          <ThemedText style={styles.ownerText}>
            Người tạo: {priceData.owner.name}
          </ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3F7D58',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#3F7D58',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  table: {
    borderWidth: 1,
    borderColor: '#3F7D58',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableHeader: {
    backgroundColor: '#3F7D58',
    padding: 14,
  },
  headerText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  tableCell: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
    minHeight: 50,
  },
  leftCell: {
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
  },
  rightCell: {
    alignItems: 'flex-end',
  },
  cellText: {
    color: '#374151',
    fontSize: 14,
  },
  boldText: {
    fontWeight: '600',
  },
  priceText: {
    color: '#3F7D58',
    fontWeight: '500',
  },
  ownerContainer: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  ownerText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
});

export default PriceTable;