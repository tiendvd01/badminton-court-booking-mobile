import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AxiosError } from "axios";
import BackIcon from "@/components/icons/BackIcon";
import AppButton from "@/components/ui/AppButton";
import AppLink from "@/components/ui/AppLink";
import AppTextInput from "@/components/ui/AppTextInput";
import { useRouter } from "expo-router";
import { useSignupMutation } from "@/repository/authRepository";

// Validation schema
export const registerSchema = yup.object().shape({
  fullName: yup.string().required("Vui lòng nhập họ tên"),
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  phone: yup
    .string()
    .matches(/^\d{10,11}$/, "Số điện thoại không hợp lệ")
    .required("Vui lòng nhập số điện thoại"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu"),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

function RegisterScreen() {
    const router = useRouter();

    const signUpMutation = useSignupMutation();

    const axiosError = signUpMutation.error as any;
    
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            password: "",
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        signUpMutation.mutate({
            name: data.fullName,
            email: data.email,
            password: data.password,
            phone: data.phone,
        }, {
            onSuccess: () => {
                router.replace("/login");
            },   
        });
    };

    const handleClickLogin = () => {
        router.push("/login");
    };

    const handleClickBack = () => {
        router.back();
    };
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
                <Controller
                    control={control}
                    name="fullName"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            label="Tên đầy đủ"
                            placeholder="Nhập tên đầy đủ của bạn"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            errorMessage={errors.fullName?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            label="Email"
                            placeholder="Nhập email của bạn"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            errorMessage={errors.email?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            label="Số điện thoại"
                            placeholder="Nhập số điện thoại của bạn"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="phone-pad"
                            errorMessage={errors.phone?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            label="Mật khẩu"
                            placeholder="Nhập mật khẩu của bạn"
                            secureTextEntry
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            errorMessage={errors.password?.message}
                        />
                    )}
                />
                <AppButton
                    title="Đăng ký"
                    onPress={handleSubmit(onSubmit)}
                    backgroundColor="#EF9651"
                    color="#FFF"
                    variant="primary"
                    styles={{
                        height: 48,
                        marginTop: 8,
                    }}
                    textStyles={{
                        fontSize: 14,
                    }}
                />
                {signUpMutation.isError && (
                    <Text style={{ color: "red" }}>
                        {(axiosError as any)?.response?.data?.message || 'An error occurred during registration'}
                    </Text>
                )}
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