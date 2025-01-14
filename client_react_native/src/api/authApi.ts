// authApi.ts
import { axiosNoToken } from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_API = '/auth';

export const authApi = {
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
          await AsyncStorage.setItem('user', JSON.stringify(user));

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

  register: async (email, fullName, phoneNumber, password) => {
      try {
         const response = await axiosNoToken.post(`${API_URL}/register`, {
          fullName,
          email,
          password,
          phoneNumber
        });

        const apiResponse = response.data;
        console.log(apiResponse);

        if (apiResponse && apiResponse.status === 201){
            const user = apiResponse.data.data;

            console.log(user);

            if (user)
                return true;
        }

      } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Có lỗi xảy ra');
      }
    },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Đăng xuất thất bại.');
    }
  },
};
