import React, { useRef } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Image } from 'expo-image';
import AppButton from '../ui/AppButton';
import { IconSymbol } from '../ui/IconSymbol';
import { ILocation } from '@/types/common';
import { usePriceTablesByLocationQuery } from '@/repository/courtRepository';
import { toMinutes } from '@/utils/helper';
import LocationDetailInfo, { BottomSheetInputHandle } from './LocationDetailInfo';

type Props = {
    location: ILocation;
};

function LocationItem({ location }: Props) {
    const { data: priceTables } = usePriceTablesByLocationQuery({ locationId: location.id });
    const bottomSheetRef = useRef<BottomSheetInputHandle>(null);
    const earliestStartTime = priceTables?.data?.data
        ?.flatMap((priceTable) => priceTable.prices)
        .reduce((earliest, current) => {
            return toMinutes(current.start_time) < toMinutes(earliest) ? current.start_time : earliest;
        }, '24:00');
    const latestEndTime = priceTables?.data?.data
        ?.flatMap((priceTable) => priceTable.prices)
        .reduce((latest, current) => {
            return toMinutes(current.end_time) > toMinutes(latest) ? current.end_time : latest;
        }, '00:00');
    const timeRange = `${earliestStartTime} - ${latestEndTime}`;

    return (
        <>
            <TouchableOpacity onPress={() => bottomSheetRef.current?.present()}>
                <ImageBackground
                    imageStyle={styles.imageContainer}
                    source={
                        location.images.length > 0
                            ? { uri: location.images?.[0].image_url }
                            : require('../../assets/images/defaultImage.jpg')
                    }
                >
                    <View style={styles.iconButtonGroup}>
                        <TouchableOpacity style={styles.iconButton}>
                            <IconSymbol name="heart" color="#EF9651" size={16} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.leftContentPart}>
                            <Image
                                source={
                                    location.logo
                                        ? { uri: location.logo }
                                        : require('../../assets/images/shuttlecock_new_bg.png')
                                }
                                style={styles.locationLogo}
                            />
                        </View>
                        <View style={styles.centerContentPart}>
                            <ThemedText style={styles.locationName}>{location.name}</ThemedText>
                            <ThemedText style={styles.locationAddress}>{location.address}</ThemedText>
                            <ThemedText style={styles.locationInfo}>
                                {timeRange} {location.owner.phone || 'Unknown'}
                            </ThemedText>
                        </View>
                        <View style={styles.rightContentPart}>
                            <AppButton
                                backgroundColor="#EF9651"
                                variant="primary"
                                title="Đặt lịch"
                                onPress={() => {}}
                            />
                        </View>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
            <LocationDetailInfo priceTables={priceTables?.data?.data} ref={bottomSheetRef} location={location} timeRange={timeRange} />
        </>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        height: 200,
        borderRadius: 8,
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        position: 'relative',
    },
    iconButtonGroup: {
        top: 10,
        right: 10,
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
    },
    iconButton: {
        borderRadius: 100,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        padding: 4,
    },
    contentContainer: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    locationLogo: {
        width: 48,
        height: 48,
        borderRadius: 100,
    },
    leftContentPart: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerContentPart: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        flex: 1,
    },
    rightContentPart: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationName: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    locationAddress: {
        fontSize: 10,
        fontWeight: 'normal',
        color: '#94A3B8',
    },
    locationInfo: {
        fontSize: 10,
        fontWeight: 'normal',
    },
});

export default LocationItem;
