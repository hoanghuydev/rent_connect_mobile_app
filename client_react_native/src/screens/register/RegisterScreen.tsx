import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Checkbox } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';

const RegisterScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptPolicy, setAcceptPolicy] = useState(false);

    // State for password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const primaryColor = '#5fcf86';
    const softGrayColor = '#E0E0E0';

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1">
                    {/* Scrollable Content Area */}
                    <ScrollView
                        className="flex-1 px-4"
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        {/* Title */}
                        <Text
                            className="text-3xl font-bold text-center my-6"
                            style={{ color: primaryColor }}
                        >
                            Đăng ký tài khoản
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

                        {/* Full Name Input */}
                        <View className="mb-4">
                            <TextInput
                                label="Họ và tên"
                                value={fullName}
                                onChangeText={setFullName}
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
                                label="Nhập mật khẩu"
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

                        {/* Confirm Password Input */}
                        <View className="mb-4">
                            <TextInput
                                label="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
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
                                            showConfirmPassword ?
                                                <Eye color={primaryColor} size={24} /> :
                                                <EyeOff color={softGrayColor} size={24} />
                                        }
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    />
                                }
                            />
                        </View>
                    </ScrollView>

                    {/* Fixed Bottom Section */}
                    <View className="px-4 pb-4">
                        {/* Policy Checkbox */}
                        <View className="flex-row items-center mb-4">
                            <Checkbox
                                status={acceptPolicy ? 'checked' : 'unchecked'}
                                onPress={() => setAcceptPolicy(!acceptPolicy)}
                                color={primaryColor}
                            />
                            <Text className="ml-2 flex-1 text-base">
                                Tôi đã đọc và đồng ý với chính sách
                            </Text>
                        </View>

                        {/* Register Button */}
                        <TouchableOpacity
                            className="py-4 rounded-full items-center"
                            style={{
                                backgroundColor: primaryColor,
                                opacity: acceptPolicy ? 1 : 0.5
                            }}
                            disabled={!acceptPolicy}
                            onPress={() => {
                                // Xử lý đăng ký
                                console.log('Đăng ký');
                            }}
                        >
                            <Text className="text-white font-bold text-lg">Đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default RegisterScreen;