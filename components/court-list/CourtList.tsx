import React, { useState } from 'react';
import CourtFilterBar from './CourtFilterBar';
import LocationList from './LocationList';
import { StyleSheet, View } from 'react-native';

function CourtList({ search }: { search?: string }) {
    const [filters, setFilters] = useState<{
        province?: string;
        district?: string;
    }>({});

    return (
        <>
            <CourtFilterBar onChange={(filters) => setFilters(filters)} />
            <View style={styles.container}>
                <LocationList {...filters} search={search} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
});

export default CourtList;
