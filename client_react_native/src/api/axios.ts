import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { jwtDecode } from 'jwt-decode';
import tokenManager from '@/utils/tokenManager';
export const SERVER_IP = '192.168.161.159'
export const PORT = '8081'
export const SERVER_URL = `http://${SERVER_IP}:${PORT}`;
export const baseURL = SERVER_URL + '/api/v1/';

// Tạo các instance của Axios
export const axiosNoToken = axios.create({
  baseURL,
//   withCredentials: true,
});

export const axiosToken = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
//   withCredentials: true,
});

axiosToken.interceptors.request.use(async (config) => {
  const accessToken = await AsyncStorage.getItem('token');
  const token = await tokenManager.getToken();
  const date = new Date();

  if (token) {
    const decodedToken: any = jwtDecode(token);

    if (decodedToken.exp < date.getTime() / 1000) {
      try {
        const resp: { accessToken: string } = await axiosNoToken.post('/auth/token/refresh');
        await AsyncStorage.setItem('accessToken', resp.accessToken);
      } catch (error) {
        console.error('Token refresh failed:', error);
        await tokenManager.removeToken();
      }
    }
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor để xử lý lỗi 401
axiosToken.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error('You are not authorized. Removing access token.');
      await tokenManager.removeToken();
    }
    return Promise.reject(error);
  }
);

axiosToken.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  console.log('Token from AsyncStorage:', token);  // In ra token để kiểm tra

  if (!token) {
    console.error('No token found');
    throw new Error('Token không hợp lệ.');
  }

  const decodedToken: any = jwtDecode(token); // Giải mã token để kiểm tra thời gian hết hạn
  const date = new Date();

  // Kiểm tra xem token đã hết hạn chưa
  if (decodedToken.exp < date.getTime() / 1000) {
    try {
      // Gửi yêu cầu làm mới token nếu token đã hết hạn
      const resp: { accessToken: string } = await axiosNoToken.post('/auth/token/refresh');
      await AsyncStorage.setItem('token', resp.accessToken);  // Cập nhật lại token
      console.log('Token refreshed successfully:', resp.accessToken);
      config.headers['Authorization'] = `Bearer ${resp.accessToken}`;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await tokenManager.removeToken();
      throw new Error('Làm mới token thất bại. Vui lòng đăng nhập lại.');
    }
  } else {
    // Nếu token chưa hết hạn, thêm token vào header của yêu cầu
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});