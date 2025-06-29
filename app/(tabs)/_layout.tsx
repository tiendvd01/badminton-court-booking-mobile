import { Tabs } from "expo-router";
import React from "react";
import HomeIcon from "@/components/icons/HomeIcon";
import MapIcon from "@/components/icons/MapIcon";
import UserIcon from "@/components/icons/UserIcon";
import { StyleSheet } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: styles.tabBar, // Change background color and increase padding
                tabBarLabelStyle: styles.tabBarLabel, // Change font size of the title
                tabBarActiveTintColor: "#EF9651", // Active tab color
                tabBarInactiveTintColor: "white", // Inactive tab color
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Trang chủ",
                    tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
                }}
            />
            {/* <Tabs.Screen
                name="map"
                options={{
                    title: "Bản đồ",
                    tabBarIcon: ({ color, size }) => <MapIcon color={color} size={size} />,
                }}
            /> */}
            <Tabs.Screen
                name="user"
                options={{
                    title: "Tài khoản",
                    tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: "#3F7D58",
        paddingTop: 4,
        borderTopWidth: 1,
        borderTopColor: "#FFFFFF",
        borderStyle: "solid",
    },
    tabBarLabel: { fontSize: 12 },
});
