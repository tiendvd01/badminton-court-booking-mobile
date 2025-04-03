import { Button, StyleSheet, View } from "react-native";

export default function TabTwoScreen() {
    return (
        <View>
            <View style={styles.header}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        flexDirection: "row",
                    }}
                >
                    <Button title="Đăng nhập" color={'#1e293b'}  />
                    <Button title="Đăng ký" />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#EF9651",
        height: 130,
        display: "flex",
        alignItems: "flex-end",
        flexDirection: "row",
    },
});
