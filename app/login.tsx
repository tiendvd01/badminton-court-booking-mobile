import BackIcon from '@/components/icons/BackIcon';
import AppButton from '@/components/ui/AppButton';
import AppLink from '@/components/ui/AppLink';
import AppTextInput from '@/components/ui/AppTextInput';
import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLoginMutation } from '@/repository/authRepository';

// Add validation schema
const loginSchema = yup.object().shape({
    email: yup
        .string()
        .required('Vui lòng nhập email hoặc số điện thoại')
        .test('emailOrPhone', 'Vui lòng nhập đúng định dạng email hoặc số điện thoại', (value) => {
            // Check if it's a valid email or phone number
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9]{10,11}$/;
            return emailRegex.test(value) || phoneRegex.test(value);
        }),
    password: yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

function LoginScreen() {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { mutate: login, isError, error } = useLoginMutation();
    // Type assertion for the error
    const axiosError = error as any;

    const onSubmit = (data: { email: string; password: string }) => {
        login(data, {
            onSuccess: () => {
                // Navigate to home or dashboard
                router.replace('/(tabs)');
            },
        });
    };
    const handleClickRegister = () => {
        router.push('/register');
    };
    const handleClickBack = () => {
        router.back();
    };

    return (
        <View>
            <View style={styles.header}>
                <ImageBackground
                    source={require('../assets/images/Head.png')}
                    resizeMode="cover"
                    style={{
                        height: '100%',
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
                            <Text style={styles.pageTitle}>Đăng nhập</Text>
                            <View style={styles.textWithLink}>
                                <Text>Bạn chưa có tài khoản ?</Text>
                                <AppLink
                                    content="Đăng ký"
                                    onPress={handleClickRegister}
                                    textStyle={{
                                        color: '#EF9651',
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
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AppTextInput
                            label="Email hoặc số điện thoại"
                            placeholder="Nhập email hoặc số điện thoại"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            errorMessage={errors.email?.message}
                            autoCapitalize="none"
                            keyboardType="email-address"
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
                    title="Đăng nhập"
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
                {isError && <Text>{axiosError.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'}</Text>}
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
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: 24,
    },
    headerContent: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    textWithLink: {
        display: 'flex',
        flexDirection: 'row',
        gap: 4,
    },
    pageTitle: {
        fontSize: 32,
        paddingTop: 16,
        fontWeight: '700',
        color: '#fff',
        paddingBottom: 12,
    },
    pageContent: {
        display: 'flex',
        gap: 16,
        padding: 24,
    },
});

export default LoginScreen;
