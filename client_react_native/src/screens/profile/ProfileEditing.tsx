import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native';
import { TextInput, Button, Card, Avatar, Text, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '@/api/authApi';
import {userApi} from "@/api/userApi";
import {User} from "@/models/User";
import UserDetail from "@/models/UserDetail";


const primaryColor = '#5fcf86';
const softGrayColor = '#E0E0E0';

const ProfileEditing = ({ navigation }: any) => {
  const theme = useTheme();
  const [user, setUser] = useState<UserDetail>();
  const [fullName,setFullName] = useState('');
  const [phoneNumber,setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          const userId = userData.userId;
          const userDetail = await userApi.getUserById(userId);
          console.log(userDetail)
          setFullName(userDetail.fullName);
          setPhoneNumber(userDetail.phoneNumber)
          setUser(userDetail)
        }
      } catch (error) {
        console.error('Error fetching user ', error);
      }
    };
    getUserData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await userApi.updateUser({fullName,phoneNumber,userId : user?.userId});
      if (result) {
        const updatedUser = result;
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        navigation.goBack();
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content"
      />
      <ScrollView style={styles.container} bounces={false}>
        {/* Header with Avatar */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={72}
              source={require('../assets/default-avatar.png')}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.headerText}>Chỉnh sửa thông tin</Text>
        </View>

        {/* Form Card */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <TextInput
              label="Họ và tên"
              value={fullName}
              onChangeText={setFullName}
              mode="outlined"
              style={styles.input}
              dense
              left={<TextInput.Icon icon="account" />}
            />
            
            <TextInput
              label="Số điện thoại"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              mode="outlined"
              style={styles.input}
              dense
              keyboardType="phone-pad"
              left={<TextInput.Icon icon="phone" />}
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={styles.cancelbutton}
                contentStyle={styles.buttonContent}
              >
                Hủy
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                loading={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Lưu thay đổi
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  avatarContainer: {
    marginBottom: 8,
  },
  avatar: {
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  cardContent: {
    padding: 12,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
    height: 48,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    backgroundColor: primaryColor,
    flex: 1,
    marginHorizontal: 6,
  },
  cancelbutton: {
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 6,
  },
  buttonContent: {
    paddingVertical: 6,
  },
});

export default ProfileEditing;