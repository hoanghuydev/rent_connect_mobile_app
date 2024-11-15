import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-paper';

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex-1 p-6 justify-center bg-white">
      <Text className="text-2xl font-bold text-center mb-6">Đăng nhập</Text>
      
      <Text className="text-lg mb-2">Số điện thoại của bạn</Text>
      <TextInput
        className="border rounded p-3 mb-4"
        placeholder="Nhập số điện thoại"
        keyboardType="phone-pad"
      />
      
      <Text className="text-lg mb-2">Mật khẩu</Text>
      <View className="border rounded flex-row items-center p-3 mb-4">
        <TextInput
          className="flex-1"
          placeholder="Nhập mật khẩu"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
        </TouchableOpacity>
      </View>

      <Text className="text-green-500 mb-6 text-right">Quên mật khẩu</Text>

      <Button mode="contained" className="bg-green-500 mb-4" onPress={() => {}}>
        Đăng nhập
      </Button>

      <View className="flex-row justify-around mb-6">
        <TouchableOpacity>
          <Icon name="google" size={40} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="facebook" size={40} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="apple" size={40} color="black" />
        </TouchableOpacity>
      </View>

      <Text className="text-center">
        Bạn chưa là thành viên? <Text className="text-green-500">Hãy đăng ký ngay</Text>
      </Text>
    </View>
  );
};

export default LoginScreen;
