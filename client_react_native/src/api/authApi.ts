import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/auth';

const authApi = {
  // Đăng nhập
  login: async ({ phoneNumber, password }: { phoneNumber: string; password: string }) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        phoneNumber,
        password,
      });
      return response;
    } catch (error: any) {
      if (error.response) {
        return error.response;
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  // Đăng ký
  register: async (userData: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) => {
    const response = await axios.post(`${BASE_URL}/register`, userData);
    return response.data;
  },

  // Kiểm tra trạng thái đăng nhập
  checkAuthStatus: async (): Promise<boolean> => {
    try {
      // Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return false; // Nếu không có token, coi như chưa đăng nhập
      }

      // Gửi yêu cầu đến backend để kiểm tra token
      const response = await axios.get(`${BASE_URL}/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Giả sử backend trả về { isAuthenticated: true/false }
      if (response.data.isAuthenticated) {
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Error checking authentication status', error);
      return false; // Nếu có lỗi, coi như chưa đăng nhập
    }
  },

  // Đăng xuất
  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('token'); // Xóa token khỏi AsyncStorage
    } catch (error) {
      console.error('Logout error', error);
    }
  },
};

export default authApi;
