import { useLocationsQuery } from '@/repository/courtRepository';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import LocationItem from './LocationItem';

function LocationList({ province, district, search }: { province?: string; district?: string; search?: string }) {
    const { data: locations } = useLocationsQuery({
        province: province?.replace(/^tinh_|^thanh_pho_/, ''),
        district: district?.replace(/^quan_|^huyen_/, ''),
        search,
    });

    const locationWithCourt = locations?.data?.data.filter((location) => location.courts.length > 0);

    return (
        <View style={styles.container}>
            {locationWithCourt?.map((location) => {
                return <LocationItem key={location.id} location={location} />;
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        gap: 10,
    },
});

export default LocationList;
