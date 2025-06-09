import { ILocation, IPriceTable } from '@/types/common';
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetScrollView,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useRef, useImperativeHandle, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ThemedText } from '../ThemedText';
import { IconSymbol } from '../ui/IconSymbol';
import { Clock, MapPin, Phone } from 'lucide-react-native';
import { TabView, SceneRendererProps, NavigationState } from 'react-native-tab-view';
import ImageGrid from '../ImageGrid';
import PriceTable from './PriceTable';

type TabRoute = {
    key: string;
    title: string;
};

type Props = {
    location: ILocation;
    timeRange: string;
    priceTables?: IPriceTable[];
};

export type BottomSheetInputHandle = {
    present: () => void;
    dismiss: () => void;
};

const LocationDetailInfo = forwardRef<BottomSheetInputHandle, Props>(({ location, timeRange, priceTables }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const { width } = useWindowDimensions();

    const [index, setIndex] = useState(0);
    const routes: TabRoute[] = [
        { key: 'price', title: 'Bảng giá' },
        { key: 'picture', title: 'Hình ảnh' },
    ];

    const renderTabBar = (
        props: SceneRendererProps & {
            navigationState: NavigationState<TabRoute>;
        },
    ) => (
        <View style={styles.tabBar}>
            {props.navigationState.routes.map((route, i) => {
                const isFocused = index === i;
                return (
                    <TouchableOpacity key={route.key} style={styles.tabItem} onPress={() => setIndex(i)}>
                        <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>{route.title}</Text>
                        {isFocused && <View style={styles.tabIndicator} />}
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    useImperativeHandle(ref, () => ({
        present: () => bottomSheetRef.current?.present(),
        dismiss: () => bottomSheetRef.current?.dismiss(),
    }));

    // Custom backdrop component
    const renderBackdrop = (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            style={{ backgroundColor: 'rgba(0, 0, 0, 1)' }}
        />
    );

    const renderScene = ({ route }: { route: { key: string } }) => {
        switch (route.key) {
            case 'price':
                return (
                    <View style={{ flex: 1, padding: 12 }}>
                        {
                            priceTables?.map((priceTable: IPriceTable) => (
                                <PriceTable key={priceTable.id} priceData={priceTable} />
                            ))
                        }
                    </View>
                );
            case 'picture':
                return (
                    <View style={{ flex: 1, padding: 8 }}>
                        {location.images.length > 0 ? (
                            <ImageGrid
                                imageUrls={location.images.map((image) => ({
                                    id: image.id.toString(),
                                    image_url: image.image_url,
                                }))}
                                onImagePress={(image) => console.log(image)}
                            />
                        ) : (
                            <ThemedText>Không có hình ảnh</ThemedText>
                        )}
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <BottomSheetModal
                snapPoints={['80%']}
                index={0}
                ref={bottomSheetRef}
                enablePanDownToClose={true}
                backdropComponent={renderBackdrop}
                enableDismissOnClose
                handleComponent={null}
            >
                <BottomSheetView style={styles.container} >
                    <TouchableOpacity style={styles.backButton} onPress={() => bottomSheetRef.current?.dismiss()}>
                        <IconSymbol name="chevron.left" size={24} color="#000" />
                    </TouchableOpacity>
                    <ImageBackground
                        resizeMode="cover"
                        source={
                            location.images.length > 0
                                ? { uri: location.images?.[0].image_url }
                                : require('../../assets/images/defaultImage.jpg')
                        }
                        style={styles.imageBackground}
                    >
                        <View style={styles.overlay} />
                        <View style={styles.locationInfoWrapper}>
                            <View style={styles.locationInfoContainer}>
                                <Image
                                    source={
                                        location.logo
                                            ? { uri: location.logo }
                                            : require('../../assets/images/shuttlecock_new_bg.png')
                                    }
                                    style={styles.locationLogo}
                                />
                                <ThemedText style={styles.locationName}>{location.name}</ThemedText>
                            </View>
                            <View>
                                <View style={styles.infoLine}>
                                    <MapPin size={20} color={'#3F7D58'} />
                                    <ThemedText style={styles.infoText}>{location.address}</ThemedText>
                                </View>
                                <View style={styles.infoLine}>
                                    <Clock size={20} color={'#3F7D58'} />
                                    <ThemedText style={styles.infoText}>{timeRange}</ThemedText>
                                </View>
                                <View style={[styles.infoLine, { borderBottomWidth: 0 }]}>
                                    <Phone size={20} color={'#3F7D58'} />
                                    <ThemedText style={styles.infoText}>
                                        {location.owner.phone || 'Chưa cập nhật'}
                                    </ThemedText>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        renderTabBar={renderTabBar}
                        onIndexChange={setIndex}
                        initialLayout={{ width }}
                        style={styles.tabView}
                    />
                </BottomSheetView>
            </BottomSheetModal>
        </>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        minHeight: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    backButton: {
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 1,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 100,
    },
    imageBackground: {
        width: '100%',
        height: 200,
    },
    locationInfoContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        borderStyle: 'solid',
    },
    locationLogo: {
        width: 48,
        height: 48,
        borderRadius: 100,
    },
    locationName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    locationInfoWrapper: {
        position: 'absolute',
        left: 12,
        right: 12,
        top: 80,
        minHeight: 180,
        backgroundColor: '#fff',
        boxShadow: '0px 4px 4px  0px rgba(0, 0, 0, 0.25)',
        borderRadius: 8,
    },
    infoLine: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        borderStyle: 'solid',
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#4B5563',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginTop: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'none',
        margin: 0,
        padding: 0,
    },
    tabLabelFocused: {
        color: '#3F7D58',
    },
    tabIndicator: {
        backgroundColor: '#3F7D58',
        height: 2,
        width: '40%',
        position: 'absolute',
        bottom: 0,
        borderRadius: 2,
    },
    tabView: {
        flex: 1,
        marginTop: 110,
    },
});

export default LocationDetailInfo;
