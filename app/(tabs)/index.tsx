import CourtList from '@/components/court-list/CourtList';
import FavoriteButton from '@/components/FavoriteButton';
import SearchBox from '@/components/SearchBox';
import AppButton from '@/components/ui/AppButton';
import useGetCurrentDateStr from '@/hooks/useGetCurrentDateStr';
import { useAuthStore } from '@/stores/authStore';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

function DashboardScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { formattedDate } = useGetCurrentDateStr();

    const handleClickLogin = () => {
        router.push('/login');
    };
    const handleClickRegister = () => {
        router.push('/register');
    };
    return (
        <View style={{ height: '100%', backgroundColor: '#FFF' }}>
            <View style={styles.headerWrapper}>
                <View style={styles.headerContent}>
                    <Image
                        style={styles.avatar}
                        source={user?.avatar_url || require('../../assets/images/shuttlecock_new_bg.png')}
                    />
                    <View style={styles.infoWrapper}>
                        <Text style={styles.date}>{formattedDate}</Text>
                        {user ? (
                            <Text style={styles.name}>{user.name}</Text>
                        ) : (
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 8,
                                }}
                            >
                                <AppButton variant="primary" title="Đăng nhập" onPress={handleClickLogin} />
                                <AppButton
                                    color="#FFF"
                                    title="Đăng ký"
                                    onPress={handleClickRegister}
                                    backgroundColor="#FFF"
                                />
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.searchBoxWrapper}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <SearchBox />
                        </View>
                        <FavoriteButton />
                    </View>
                </View>
            </View>
            <ScrollView style={styles.courtListWrapper}>
                <CourtList />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    headerWrapper: {
        backgroundColor: '#3F7D58',
        paddingHorizontal: 16,
        height: 140,
        position: 'relative',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    searchBoxWrapper: {
        zIndex: 3,
        position: 'absolute',
        bottom: -20,
        left: 16,
        right: 16,
    },
    headerContent: {
        marginBottom: 30,
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
    },
    avatar: {
        borderRadius: 100,
        width: 56,
        height: 56,
    },
    infoWrapper: {
        display: 'flex',
        gap: 4,
        paddingVertical: 4,
        justifyContent: 'space-between',
    },
    date: {
        color: '#fff',
        fontSize: 14,
    },
    name: {
        color: '#EF9651',
        fontSize: 18,
        fontWeight: 'bold',
    },
    courtListWrapper: {
        padding: 16,
        paddingTop: 24,
        backgroundColor: '#FFF',
        flex: 1,
        minHeight: 600,
    },
});

export default DashboardScreen;
