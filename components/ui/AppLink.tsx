import React from "react";
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from "react-native";

interface AppLinkProps {
  onPress: (event: GestureResponderEvent) => void;
  content: string;
  textStyle?: object;
}

const AppLink: React.FC<AppLinkProps> = ({ onPress, content, textStyle }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} >
      <Text style={[styles.linkText, textStyle]}>{content}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linkText: {
    textDecorationLine: "underline",
    color: "#007BFF", // Default link color
  },
});

export default AppLink;
