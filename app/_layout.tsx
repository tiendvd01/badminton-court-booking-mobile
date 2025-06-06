import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
    const { initUserFromAsyncStorage } = useAuthStore();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        FiraCode: require('../assets/fonts/FiraCode-SemiBold.ttf'),
    });

    useEffect(() => {
        initUserFromAsyncStorage();
    }, []);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider value={DefaultTheme}>
                <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                    <GestureHandlerRootView style={styles.container}>
                        <Stack
                            screenOptions={{
                                contentStyle: { backgroundColor: '#FFFFFF', flex: 1 },
                            }}
                        >
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="login" options={{ headerShown: false }} />
                            <Stack.Screen name="register" options={{ headerShown: false }} />
                            <Stack.Screen name="user" options={{ headerShown: false }} />
                            <Stack.Screen name="+not-found" />
                        </Stack>
                    </GestureHandlerRootView>
                    <StatusBar style="auto" />
                </View>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 999,
        flex: 1,
        backgroundColor: 'grey',
    },
});
