import React from "react";
import { StyleSheet, Pressable, View, GestureResponderEvent } from "react-native";
import HeartIcon from "./icons/HeartIcon";
import FillHeartIcon from "./icons/FillHeartIcon";

interface FavoriteButtonProps {
    onPress?: (event: GestureResponderEvent) => void;
    state?: "normal" | "active";
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ onPress, state = 'normal' }) => {
    const buttonIcon =
        state === "active" ? <FillHeartIcon size={24} color="#000" /> : <HeartIcon size={24} color="#000" />;
    return (
        <Pressable style={styles.button} onPress={onPress} android_ripple={null}>
            <View style={styles.iconContainer}>{buttonIcon}</View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4, // For Android shadow
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
});

export default FavoriteButton;
