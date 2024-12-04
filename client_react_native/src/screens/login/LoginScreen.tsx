import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";
import { RegisterScreenNavigationProp } from "@/navigation/type";

const LoginScreen = () => {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const primaryColor = '#5fcf86';
    const softGrayColor = '#E0E0E0';

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1 px-4"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                >
                    {/* Title */}
                    <Text
                        className="text-3xl font-bold text-center mb-8"
                        style={{ color: primaryColor }}
                    >
                        Đăng nhập
                    </Text>

                    {/* Phone Number Input */}
                    <View className="mb-4">
                        <TextInput
                            label="Số điện thoại"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            mode="outlined"
                            outlineColor={softGrayColor}
                            activeOutlineColor={primaryColor}
                            theme={{
                                colors: {
                                    placeholder: softGrayColor,
                                }
                            }}
                        />
                    </View>

                    {/* Password Input */}
                    <View className="mb-4">
                        <TextInput
                            label="Mật khẩu"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            mode="outlined"
                            outlineColor={softGrayColor}
                            activeOutlineColor={primaryColor}
                            theme={{
                                colors: {
                                    placeholder: softGrayColor,
                                }
                            }}
                            right={
                                <TextInput.Icon
                                    icon={() =>
                                        showPassword ?
                                            <Eye color={primaryColor} size={24} /> :
                                            <EyeOff color={softGrayColor} size={24} />
                                    }
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            }
                        />
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity className="self-end mb-6">
                        <Text style={{ color: primaryColor }}>Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity
                        className="py-4 rounded-full items-center mb-6"
                        style={{ backgroundColor: primaryColor }}
                        onPress={() => {
                            // Xử lý đăng nhập
                            console.log('Đăng nhập');
                        }}
                    >
                        <Text className="text-white font-bold text-lg">Đăng nhập</Text>
                    </TouchableOpacity>

                    {/* Social Login */}
                    <View className="flex-row gap-3 justify-center space-x-6 mb-6">
                        <TouchableOpacity
                            className="p-3 rounded-full border"
                            style={{ borderColor: softGrayColor }}
                        >
                            <Icon name="google" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="p-3 rounded-full border"
                            style={{ borderColor: softGrayColor }}
                        >
                            <Icon name="facebook" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="p-3 rounded-full border"
                            style={{ borderColor: softGrayColor }}
                        >
                            <Icon name="apple" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Register Prompt */}
                    <View className="flex-row justify-center">
                        <Text>Bạn chưa là thành viên? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={{ color: primaryColor }}>Hãy đăng ký ngay</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;