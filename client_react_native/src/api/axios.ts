import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { jwtDecode } from 'jwt-decode';
import tokenManager from '@/utils/tokenManager';

const SERVER_URL = 'http://192.168.1.238:8081';
export const baseURL = SERVER_URL + '/api/v1/';

// Tạo các instance của Axios
export const axiosNoToken = axios.create({
  baseURL,
//   withCredentials: true,
});

export const axiosToken = axios.create({
  baseURL,
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
