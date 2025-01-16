import { axiosToken } from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RENT_API = '/rent';

const rentApi = {
    rentCar: async (carId: number, startDate: string, endDate: string) => {
        try {
            // Lấy token không bao gồm phần "Bearer"
            const fullToken = await AsyncStorage.getItem('token');
            const token = fullToken?.replace('Bearer ', '');

            if (!token) {
                throw new Error('Vui lòng đăng nhập để đặt xe');
            }

            console.log('Sending request with token:', token);

            const response = await axiosToken.post(`${RENT_API}`, {
                carId,
                startDate,
                endDate
            });

            console.log('Rent response:', response.data);
            return response.data;

        } catch (error: any) {
            console.error('Rent car error details:', error.response || error);
            if (error.response?.status === 401) {
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
            }
            if (error.response?.status === 500) {
                throw new Error('Ngày bạn chọn đã được thuê. Vui lòng chọn ngày khác!');
            }
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt xe');
        }
    },
};

export default rentApi;