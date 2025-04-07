import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import BackIcon from "@/components/icons/BackIcon";
import AppButton from "@/components/ui/AppButton";
import AppLink from "@/components/ui/AppLink";
import AppTextInput from "@/components/ui/AppTextInput";
import { useRouter } from "expo-router";

function RegisterScreen() {
    const router = useRouter();
    const handleClickLogin = () => {
        router.push("/login");
    }
    const handleClickBack = () => {
      router.push("/(tabs)/user");
    }
    return (
        <View>
            <View style={styles.header}>
                <ImageBackground
                    source={require("../assets/images/Head.png")}
                    resizeMode="cover"
                    style={{
                        height: "100%",
                    }}
                >
                    <View style={styles.headerContentWrapper}>
                        <View style={styles.headerContent}>
                            <View>
                                <AppButton
                                    title=""
                                    onPress={handleClickBack}
                                    icon={<BackIcon size={32} color="#FFF" />}
                                    backgroundColor="transparent"
                                    styles={{
                                        width: 48,
                                        height: 48,
                                    }}
                                />
                            </View>
                            <Text style={styles.pageTitle}>Đăng ký</Text>
                            <View style={styles.textWithLink}>
                                <Text>Bạn đã có tài khoản? </Text>
                                <AppLink
                                    content="Đăng nhập"
                                    onPress={handleClickLogin}
                                    textStyle={{
                                        color: "#EF9651",
                                    }}
                                />
                            </View>
                        </View>
                        <View></View>
                    </View>
                </ImageBackground>
            </View>
            <View style={styles.pageContent}>
                <AppTextInput label="Tên đầy đủ" placeholder="Nhập tên đầy đủ của bạn" />
                <AppTextInput label="Email" placeholder="Nhập email của bạn" />
                <AppTextInput label="Số điện thoại" placeholder="Nhập số điện thoại của bạn" />
                <AppTextInput
                    label="Mật khẩu"
                    placeholder="Nhập mật khẩu của bạn"
                    type="password"
                />
                <AppButton
                    title="Đăng ký"
                    onPress={() => {}}
                    backgroundColor="#EF9651"
                    color="#FFF"
                    variant="primary"
                    styles={{
                        height: 48,
                    }}
                    textStyles={{
                        fontSize: 14,
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 210,
    },
    headerContentWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",
        padding: 24,
    },
    headerContent: {
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
    },
    textWithLink: {
        display: "flex",
        flexDirection: "row",
        gap: 4,
    },
    pageTitle: {
        fontSize: 32,
        paddingTop: 16,
        fontWeight: "700",
        color: "#fff",
        paddingBottom: 12,
    },
    pageContent: {
        display: "flex",
        gap: 16,
        padding: 24,
    },
});

export default RegisterScreen;