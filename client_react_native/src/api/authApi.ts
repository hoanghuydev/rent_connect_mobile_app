// authApi.ts
import { axiosNoToken } from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tokenManager from '@/utils/tokenManager';
import UserManager from '@/utils/UserManager';
import { User } from '@/models/User';

const AUTH_API = '/auth';

export const authApi = {
    oAuth2Google : async (token : string) => {
        try {
            const response = await axiosNoToken.post(`/oauth2/callback/google`, {
                token
            });

            const apiResponse = response.data;

            if (apiResponse && apiResponse.status === 200) {
                const { user, token } = apiResponse.data.data;

                // Lưu trữ token và thông tin người dùng vào AsyncStorage
                await AsyncStorage.setItem('token', token);
                await tokenManager.setToken(token);
                await AsyncStorage.setItem('user', JSON.stringify(user));
                const userData = new User(user);
                await UserManager.setUser(userData);

                console.log('Login success:', response);

                return { success: true, token };
            } else {
                throw new Error(apiResponse.message || 'Đăng nhập thất bại.');
            }
        } catch (error: any) {
            console.error('Login failed:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Đăng nhập thất bại.');
        }
    },
  login: async (email: string, password: string) => {
      console.log("call api login");
      try {
        // Gửi request đến API
        const response = await axiosNoToken.post(`${AUTH_API}/login`, {
          email,
          password,
        });

        // Trích xuất phản hồi từ server
        const apiResponse = response.data;

        if (apiResponse && apiResponse.status === 202) { // Kiểm tra trạng thái phản hồi
          const { user, token } = apiResponse.data.data; // Trích xuất dữ liệu token

          // Lưu trữ token và thông tin người dùng vào AsyncStorage
          await AsyncStorage.setItem('token', token);
          await tokenManager.setToken(token);
          await AsyncStorage.setItem('user', JSON.stringify(user));
          const userData = new User(user);
          await UserManager.setUser(userData);

          console.log('Login success:', response);

          return { success: true, token };
        } else {
          throw new Error(apiResponse.message || 'Đăng nhập thất bại.');
        }
      } catch (error: any) {
        console.error('Login failed:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Đăng nhập thất bại.');
      }
  },

  register: async (email: string, fullName: string, phoneNumber: string, password: string) => {
      try {
          const response = await axiosNoToken.post(`${AUTH_API}/register`, {
              fullName,
              email,
              password,
              phoneNumber
          });

          const apiResponse = response.data;
          console.log('Register response:', apiResponse);

          if (apiResponse && apiResponse.status === 201) {
              return true;
          }
          return false;

      } catch (error: any) {
          console.error('Register error:', error.response?.data || error);
          throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
      }
  },

  logout: async () => {
    try {
      await tokenManager.removeToken();
      await UserManager.removeUser();
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Đăng xuất thất bại.');
    }
  },
};
