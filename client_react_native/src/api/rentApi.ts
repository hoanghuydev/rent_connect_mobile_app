//cần sửa
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosToken } from './axios';
import UserManager from '@/utils/UserManager'; // Nếu bạn đã có UserManager
import { User } from '@/models/User'; // Nếu bạn đã có model User

const RENT_API = '/rent';

const rentApi = {
    // Thuê xe với carId, startDate và endDate
    rentCar: async (carId: number, startDate: string, endDate: string) => {
        try {
            // Kiểm tra thông tin người dùng
            let userId = UserManager.getUser()?.userId;

            // Nếu không có userId trong bộ nhớ, kiểm tra AsyncStorage
            if (!userId) {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    userId = parsedUser.userId;
                }
            }

            // Nếu không tìm thấy userId, báo lỗi
            if (!userId) {
                console.error('User ID not found.');
                throw new Error('User not logged in or user ID not available.');
            }

            // Lấy token từ AsyncStorage và kiểm tra
            const token = await AsyncStorage.getItem('token');
            console.log('Access Token:', token);  // Kiểm tra token

            if (!token || token.split('.').length !== 3) {
                console.error('Invalid token format');
                throw new Error('Invalid token format');
            }

            // Thêm token vào header Authorization
            const rentalData = { carId, userId, startDate, endDate };
            const response = await axiosToken.post(`${RENT_API}`, rentalData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Trả về kết quả từ API
            return response.data;
        } catch (error: any) {
            console.error('Rent car error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi thuê xe');
        }
    },
};

export default rentApi;
