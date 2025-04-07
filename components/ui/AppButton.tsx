import React from "react";
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, View } from "react-native";

interface AppButtonProps {
    onPress: (event: GestureResponderEvent) => void;
    title: string;
    backgroundColor?: string;
    color?: string;
    variant?: "primary" | "secondary";
    icon?: React.ReactNode;
    styles?: object;
    textStyles?: object;
}

const AppButton: React.FC<AppButtonProps> = ({
    onPress,
    title,
    backgroundColor = "#FFF",
    color = "#000",
    variant = "secondary",
    icon,
    styles: customStyles = {},
    textStyles = {},
}) => {
    const dynamicStyle =
        variant === "secondary"
            ? { ...styles.secondary, borderColor: backgroundColor }
            : { backgroundColor: backgroundColor };
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[
                styles.appButtonContainer,
                dynamicStyle,
                customStyles,
            ]}
        >
            {icon ? (
                <View style={styles.buttonWithIcon}>
                    {icon}
                    <Text></Text>
                </View>
            ) : (
                <Text
                    style={[{
                        ...styles.appButtonText,
                        color: color,
                    }, textStyles]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    appButtonContainer: {
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    appButtonText: { fontSize: 12, fontWeight: "semibold" },
    secondary: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderStyle: "solid",
    },
    buttonWithIcon: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

export default AppButton;
