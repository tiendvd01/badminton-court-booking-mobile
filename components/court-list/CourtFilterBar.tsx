import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Text, LayoutChangeEvent } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AppSelect, { SelectOption } from '@/components/ui/AppSelect';
import PlaceholderIcon from '../icons/PlaceholderIcon';
import AppButton from '../ui/AppButton';
import { useProvincesQuery } from '@/repository/resourceRepository';

interface CourtFilterBarProps {
    onChange?: (filters: {
        province?: string;
        district?: string;
    }) => void;
}

function CourtFilterBar({ onChange }: CourtFilterBarProps) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const colorScheme = useColorScheme() ?? 'light';
    const [headerHeight, setHeaderHeight] = useState(60);
    const [contentHeight, setContentHeight] = useState(0);
    const animatedHeight = useRef(new Animated.Value(headerHeight)).current;
    const provinceQuery = useProvincesQuery({ enabled: !isCollapsed });

    // State for selected values
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');

    // Sample options
    const provinceOptions: SelectOption[] =
        provinceQuery.data?.data?.map((province: any) => ({
            value: province.codename,
            label: province.name,
        })) || [];

    const districtOptions: SelectOption[] =
        provinceQuery.data?.data
            ?.find((provinceItem: any) => provinceItem.codename == province)
            ?.districts?.map((district: any) => ({
                value: district.codename,
                label: district.name,
            })) || [];

    // Update animated height when header or content height changes
    useEffect(() => {
        animatedHeight.setValue(isCollapsed ? headerHeight : headerHeight + contentHeight);
    }, [headerHeight, contentHeight, isCollapsed]);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        Animated.timing(animatedHeight, {
            toValue: isCollapsed ? headerHeight + contentHeight : headerHeight,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const onHeaderLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        setHeaderHeight(height);
    };

    const onContentLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        setContentHeight(height);
    };

    // Handle filter changes
    const handleFilterChange = useCallback((updates: { province?: string; district?: string }) => {
        if (updates.province !== undefined) setProvince(updates.province);
        if (updates.district !== undefined) setDistrict(updates.district);
    }, []);

    const handleProvinceChange = (value: string) => {
        handleFilterChange({ province: value, district: '' });
    };

    const handleDistrictChange = (value: string) => {
        handleFilterChange({ district: value });
    };

    // Handle reset button press
    const handleReset = () => {
        setProvince('');
        setDistrict('');
        if (onChange) {
            onChange({ province: '', district: '' });
        }
    };

    // Handle search button press
    const handleSearch = () => {
        if (onChange) {
            onChange({ province, district });
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    height: animatedHeight,
                    backgroundColor: colorScheme === 'light' ? '#F0F0F0' : '#333333',
                    borderColor: colorScheme === 'light' ? '#E0E0E0' : '#444444',
                },
            ]}
        >
            {/* Header - Always visible */}
            <View style={styles.header} onLayout={onHeaderLayout}>
                <View style={styles.searchSection}>
                    <PlaceholderIcon />
                    <Text style={[styles.searchText]}>Tìm kiếm với filter</Text>
                </View>
                <TouchableOpacity onPress={toggleCollapse}>
                    <IconSymbol
                        name="slider.horizontal.3"
                        size={24}
                        color={colorScheme === 'light' ? Colors.light.text : Colors.dark.text}
                    />
                </TouchableOpacity>
            </View>

            {/* Expanded content - hidden when collapsed */}
            <View
                style={[styles.expandedContent, { display: isCollapsed ? 'none' : 'flex' }]}
                onLayout={onContentLayout}
            >
                <View style={styles.filterRow}>
                    <View style={styles.selectContainer}>
                        <AppSelect
                            options={provinceOptions}
                            placeholder="Tỉnh/TP"
                            value={province}
                            onChange={handleProvinceChange}
                        />
                    </View>

                    <View style={styles.selectContainer}>
                        <AppSelect
                            options={districtOptions}
                            placeholder="Quận/Huyện"
                            value={district}
                            onChange={handleDistrictChange}
                        />
                    </View>
                </View>

                <View style={styles.filterRow}>
                    <View style={styles.actionRow}>
                        <AppButton
                            title="Tìm kiếm"
                            backgroundColor="#2ecc71"
                            color="#fff"
                            styles={{ height: 42 }}
                            onPress={handleSearch}
                            variant="primary"
                        />

                        <AppButton
                            title=""
                            backgroundColor="#f39c12"
                            color="#fff"
                            styles={{ width: 44, height: 42 }}
                            onPress={handleReset}
                            variant="primary"
                            icon={<IconSymbol name="arrow.clockwise" size={24} color="#fff" />}
                        />
                    </View>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        minHeight: 36,
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    searchText: {
        fontSize: 14,
        color: '#EF9651',
    },
    expandedContent: {
        paddingHorizontal: 10,
    },
    filterRow: {
        flexDirection: 'row',
        gap: 10,
        paddingBottom: 10,
    },
    selectContainer: {
        flex: 1,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
});

export default CourtFilterBar;
