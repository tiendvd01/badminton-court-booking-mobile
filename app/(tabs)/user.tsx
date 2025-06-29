import AppButton from '@/components/ui/AppButton';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { NavigationState, SceneRendererProps, TabView } from 'react-native-tab-view';
import { useState } from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';
import BookingHistoryList from '@/components/history/BookingHistoryList';
import { useQueryClient } from '@tanstack/react-query';

type TabRoute = {
    key: string;
    title: string;
    icon?: string;
};

export default function LoginScreen() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const queryClient = useQueryClient();
    const [tabIndex, setTabIndex] = useState(0);
    const { width } = useWindowDimensions();
    const routes: TabRoute[] = [
        {
            key: 'history',
            title: 'Danh sách lịch đã đặt',
            icon: 'clock.fill',
        },
    ];

    const handleClickLogin = () => {
        router.push('/login');
    };

    const handleClickRegister = () => {
        router.push('/register');
    };

    const renderTabBar = (
        props: SceneRendererProps & {
            navigationState: NavigationState<TabRoute>;
        },
    ) => (
        <View style={styles.tabBar}>
            {props.navigationState.routes.map((route, i) => {
                const isFocused = tabIndex === i;
                return (
                    <TouchableOpacity key={route.key} style={styles.tabItem} onPress={() => setTabIndex(i)}>
                        <View style={styles.tabContent}>
                            {route.icon && <IconSymbol name={route.icon as any} size={24} color="#FFFFFF" />}
                            <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>{route.title}</Text>
                        </View>
                        {isFocused && <View style={styles.tabIndicator} />}
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    const renderScene = ({ route }: { route: { key: string } }) => {
        switch (route.key) {
            case 'history':
                return (
                    <ScrollView style={styles.historyListContainer}>
                        <BookingHistoryList />
                    </ScrollView>
                );
            default:
                return null;
        }
    };
    const handleClickLogout = () => {
        logout(() => {
            queryClient.invalidateQueries();
        });
    };

    return (
        <ScrollView contentContainerStyle={{ backgroundColor: '#3F7D58', height: '100%' }}>
            <View style={styles.header}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: 12,
                        padding: 12,
                        paddingTop: 80,
                    }}
                >
                    {!user ? (
                        <>
                            <AppButton variant="primary" title="Đăng nhập" onPress={handleClickLogin} />
                            <AppButton
                                color="#FFF"
                                title="Đăng ký"
                                onPress={handleClickRegister}
                                backgroundColor="#FFF"
                            />
                        </>
                    ) : (
                        <AppButton variant="primary" title="Đăng xuất" onPress={handleClickLogout} />
                    )}
                </View>
                <View style={styles.avatarContainer}>
                    <Image style={styles.avatar} source={require('../../assets/images/cat.png')} />
                    <Text style={styles.text}>{user?.name || 'Khách'}</Text>
                </View>
            </View>
            <TabView<(typeof routes)[number]>
                navigationState={{ index: tabIndex, routes }}
                renderScene={renderScene}
                renderTabBar={renderTabBar as any}
                onIndexChange={setTabIndex}
                initialLayout={{ width }}
                style={styles.tabView}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#EF9651',
        height: 180,
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'row',
        position: 'relative',
    },
    avatarContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: -80,
        left: 0,
        right: 0,
        gap: 12,
    },
    avatar: {
        borderRadius: '100%',
        width: 90,
        height: 90,
    },
    text: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    tabBar: {
        flexDirection: 'row',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginTop: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    tabIcon: {
        marginRight: 6,
    },
    tabLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textTransform: 'none',
        margin: 0,
        padding: 0,
    },
    tabLabelFocused: {
        color: '#FFFFFF',
    },
    tabIndicator: {
        backgroundColor: '#FFFFFF',
        height: 2, // Increased from 2 to 4 for better visibility
        width: '100%',
        position: 'absolute',
        bottom: 0,
        borderRadius: 2,
    },
    tabView: {
        flex: 1,
        marginTop: 70,
    },
    historyListContainer: {
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
});
