// ProfileEditing.tsx
import React, { useState, useEffect } from 'react';
import { TextInput, Button, View, Text } from 'react-native';
import { authApi } from '@/api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileEditing = ({ navigation }: any) => {
    const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Giả sử bạn đã lấy thông tin người dùng hiện tại từ AsyncStorage hoặc Redux
  useEffect(() => {
    // Giả sử bạn lấy thông tin người dùng từ AsyncStorage
    const getUserData = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        setUserId(userData.userId);
        setFullName(userData.fullName);
        setEmail(userData.email);
        setPhoneNumber(userData.phoneNumber);
      }
    };
    getUserData();
  }, []);

  const handleSave = async () => {
    
    try {
      const result = await authApi.updateUser(userId, fullName, email, phoneNumber);
      if (result.success) {
        // Thành công, bạn có thể thông báo cho người dùng hoặc điều hướng về màn hình Profile
        console.log('Cập nhật thành công');
        navigation.goBack(); // Trở lại màn hình trước đó (ProfileScreen)
      }
    } catch (error) {
      console.error('Cập nhật thông tin thất bại:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <View>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full Name"
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone Number"
        keyboardType="phone-pad"
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default ProfileEditing;
