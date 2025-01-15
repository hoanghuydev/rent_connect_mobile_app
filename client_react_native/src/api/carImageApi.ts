import { axiosNoToken } from './axios';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CAR_IMAGE_API = '/carImage';
const CAR_IMAGES_STORAGE_KEY = 'car_images_';

interface CarImagesResponse {
    status: number;
    message: string;
    data: {
        carImage: string[];
    };
}

const carImageApi = {
    // Lấy danh sách hình ảnh theo carId
    getImagesByCarId: async (carId: number): Promise<string[]> => {
        try {
            // Gọi API để lấy danh sách hình ảnh
            const response = await axiosNoToken.get<CarImagesResponse>(`${CAR_IMAGE_API}/${carId}`);

            // Log để debug
            console.log('Car Images Response:', response.data);

            if (response.data && response.data.status === 200) {
                const images = response.data.data.carImage;

                // Cache lại danh sách hình ảnh
                await AsyncStorage.setItem(
                    `${CAR_IMAGES_STORAGE_KEY}${carId}`,
                    JSON.stringify(images)
                );

                return images;
            }

            return [];

        } catch (error: any) {
            console.error('Get car images error:', error.response?.data || error);

            // Nếu có lỗi, thử lấy dữ liệu từ cache
            try {
                const cachedImages = await AsyncStorage.getItem(`${CAR_IMAGES_STORAGE_KEY}${carId}`);
                if (cachedImages) {
                    return JSON.parse(cachedImages);
                }
            } catch (storageError) {
                console.error('Error reading images from AsyncStorage:', storageError);
            }

            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi lấy hình ảnh xe');
        }
    }
};

export default carImageApi;