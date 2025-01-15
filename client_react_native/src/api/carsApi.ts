import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosToken, axiosNoToken } from './axios';
import UserManager from '@/utils/UserManager';
import { User } from '@/models/User';

const CAR_API = '/car';
const CARS_STORAGE_KEY = 'cars_data';

const carsApi = {
    // Lấy danh sách xe
    getAllCars: async () => {
        try {
            const response = await axiosNoToken.get(`${CAR_API}/cars`);
            console.log('Raw API Response:', response); // Debug log

            if (response.data && response.data.status === 200) {
                return {
                    status: response.data.status,
                    data: response.data.data
                };
            }
            throw new Error('Invalid response format');
        } catch (error) {
            console.error('Get all cars error:', error);
            throw error;
        }
    },

    getCarDetails : async (id : number) => {
        try {
            const response = await axiosNoToken.get(`${CAR_API}/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Search cars error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi tìm kiếm xe');
        }
    },

    // Tìm kiếm xe
    searchCars: async (query: string) => {
        try {
            const response = await axiosNoToken.get(`${CAR_API}/search`, {
                params: { query }
            });
            return response.data;
        } catch (error: any) {
            console.error('Search cars error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi tìm kiếm xe');
        }
    },

    // Lọc xe theo địa điểm và thời gian
    filterCars: async (location: string, startDate: string, endDate: string) => {
        try {
            const response = await axiosNoToken.get(`${CAR_API}/filter`, {
                params: {
                    location,
                    startDate,
                    endDate
                }
            });
            return response.data;
        } catch (error: any) {
            console.error('Filter cars error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi lọc xe');
        }
    },

    // Lấy danh sách xe theo chủ xe (yêu cầu đăng nhập)
    getCarsByOwner: async () => {
        try {
            let userId = UserManager.getUser()?.userId;

            // 2. If not found, try getting user data from AsyncStorage
            if (!userId) {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    userId = parsedUser.userId;
                }
            }

            // 3. If still not found, handle the case (e.g., user not logged in)
            if (!userId) {
                console.error('User ID not found.');
                throw new Error('User not logged in or user ID not available.');
            }
            const response = await axiosNoToken.get(`${CAR_API}/owner/${userId}`);
            console.log('eee', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Get owner cars error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách xe của bạn');
        }
    },

    // Thêm xe mới (yêu cầu đăng nhập)
    addCar: async (carData: any) => {
        try {
            const response = await axiosToken.post(`${CAR_API}`, carData);
            return response.data;
        } catch (error: any) {
            console.error('Add car error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm xe');
        }
    },

    // Cập nhật thông tin xe (yêu cầu đăng nhập)
    updateCar: async (id: string, carData: any) => {
        try {
            const response = await axiosToken.put(`${CAR_API}/${id}`, carData);
            return response.data;
        } catch (error: any) {
            console.error('Update car error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin xe');
        }
    },

    // Xóa xe (yêu cầu đăng nhập)
    deleteCar: async (id: string) => {
        try {
            const response = await axiosToken.delete(`${CAR_API}/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Delete car error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa xe');
        }
    }
};

export default carsApi;