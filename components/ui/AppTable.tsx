import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
  useWindowDimensions,
  Dimensions,
} from 'react-native';

export interface PriceTableProps {
  /** Column headers, e.g. `['Thứ', 'Khung giờ', 'Cố định', 'Vãng lai']` */
  headers: string[];
  /** 2-D array of rows; each inner array length must equal `headers.length` */
  data: (string | number)[][];
  /** Optional wrapper style for the whole table */
  containerStyle?: StyleProp<ViewStyle>;
  /** Optional style override for every cell */
  cellStyle?: StyleProp<TextStyle>;
  /** Optional style override for header cells */
  headerCellStyle?: StyleProp<TextStyle>;
}

const PriceTable: React.FC<PriceTableProps> = ({
  headers,
  data,
  containerStyle,
  cellStyle,
  headerCellStyle,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const columnWidth = useMemo(() => {
    // Calculate column width based on screen width and number of columns
    const numColumns = headers.length;
    return (screenWidth - 32) / numColumns; // Subtracting padding (16 on each side)
  }, [headers.length, screenWidth]);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.table}>
        {/* Header row */}
        <View style={[styles.row, styles.headerRow]}>
          {headers.map((header, idx) => (
            <View 
              key={idx} 
              style={[styles.cellContainer, { width: columnWidth }]}
            >
              <Text
                style={[styles.cell, styles.headerCell, headerCellStyle]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {header}
              </Text>
            </View>
          ))}
        </View>

        {/* Body rows */}
        <ScrollView>
          {data.map((row, rowIdx) => (
            <View key={rowIdx} style={[styles.row, rowIdx % 2 === 0 ? styles.evenRow : styles.oddRow]}>
              {row.map((cell, cellIdx) => (
                <View 
                  key={cellIdx} 
                  style={[styles.cellContainer, { width: columnWidth }]}
                >
                  <Text 
                    style={[styles.cell, cellStyle]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {cell}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )
};

export default PriceTable;

/* ---------- Styles ---------- */
const BORDER_COLOR = '#28513855'; // subtle green w/ transparency

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 6,
    overflow: 'hidden',
    maxHeight: 400, // Prevent table from growing too tall
  },
  row: {
    flexDirection: 'row',
    minHeight: 44, // Minimum touch target size
  },
  headerRow: {
    backgroundColor: '#e8f3ea',
  },
  evenRow: {
    backgroundColor: '#ffffff',
  },
  oddRow: {
    backgroundColor: '#f8f9fa',
  },
  cellContainer: {
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: BORDER_COLOR,
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  headerCell: {
    fontWeight: '700',
    color: '#2c3e50',
  },
});
