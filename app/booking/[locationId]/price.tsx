import PriceTable from '@/components/court-list/PriceTable';
import { ThemedText } from '@/components/ThemedText';
import { usePriceTablesByLocationQuery } from '@/repository/courtRepository';
import { router, useGlobalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function PriceScreen() {
    const { locationId } = useGlobalSearchParams();

    const priceTablesQuery = usePriceTablesByLocationQuery({
        locationId: Number(locationId),
        enabled: !!locationId,
    })
    const priceTables = priceTablesQuery.data?.data?.data || [];

    return (
        <>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chi tiết bảng giá</Text>
                </View>
                <View>
                    <FlatList
                        data={priceTables}
                        keyExtractor={(item, index) => `price-table-${index}`}
                        renderItem={({ item: priceTable }) => (
                            <View>
                                <View>
                                    <ThemedText style={styles.title}>{priceTable?.name || 'No name'}</ThemedText>
                                    {priceTable?.description && (
                                        <ThemedText style={styles.description}>{priceTable.description}</ThemedText>
                                    )}
                                </View>
                                {priceTable?.prices?.length > 0 ? (
                                    <PriceTable priceData={priceTable} />
                                ) : (
                                    <View style={styles.noPriceData}>
                                        <ThemedText>Không có dữ liệu giá</ThemedText>
                                    </View>
                                )}
                            </View>
                        )}
                        contentContainerStyle={styles.priceListContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#FFFFFF',
        paddingHorizontal: 16,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#FFFFFF',
    },
    noPriceData: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginTop: 8,
    },
    priceListContent: {
        paddingBottom: 16,
    },
});
export default PriceScreen;
