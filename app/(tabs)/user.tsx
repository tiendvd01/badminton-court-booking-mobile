import AppButton from "@/components/ui/AppButton";
import { StyleSheet, View } from "react-native";
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const router = useRouter();

    const handleClickLogin = () => {
        router.push("/login");
    }

    const handleClickRegister = () => {
        router.push("/register");
    }

    return (
        <View>
            <View style={styles.header}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 12,
                        padding: 12,
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
