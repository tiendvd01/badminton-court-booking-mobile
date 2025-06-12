import { Stack } from "expo-router";

function Layout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="price" options={{ headerShown: false }} />
            <Stack.Screen name="confirm" options={{ headerShown: false }} />
            <Stack.Screen name="[bookingId]" options={{ headerShown: false }} />
        </Stack>
    );
}

export default Layout;