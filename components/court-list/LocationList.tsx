import { useLocationsQuery } from '@/repository/courtRepository';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import LocationItem from './LocationItem';

function LocationList() {
    const { data: locations } = useLocationsQuery({});

    const locationWithCourt = locations?.data?.data.filter((location) => location.courts.length > 0 || 1);

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
