import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/auth';

const authApi = {
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
  register: async (userData: {
    fullName: string;
    phoneNumber: string;
    password: string;
  }) => {
    const response = await axios.post(`${BASE_URL}/register`, userData);
    return response.data;
  },
};

export default authApi;
