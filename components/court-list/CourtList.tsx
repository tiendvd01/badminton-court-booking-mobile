import React from 'react';
import CourtFilterBar from './CourtFilterBar';
import LocationList from './LocationList';
import { StyleSheet, View } from 'react-native';

function CourtList() {
    return <>
        <CourtFilterBar />
        <View style={styles.container}>
            <LocationList />
        </View>
    </>;
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    }
});

export default CourtList;
