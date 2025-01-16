import { axiosToken } from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import carsApi from "@/api/carsApi";
import Rental from "@/models/Rental";

const RENT_API = '/rent';

interface Amenity {
    amenityId: number;
    amenityName: string;
    icon: string;
}

interface Location {
    addressLine: string;
    province: string;
    district: string;
    ward: string;
    latitude: number;
    longitude: number;
}

interface Car {
    carId: number;
    carName: string;
    description: string;
    pricePerDay: number;
    amenities: Amenity[];
    location: Location;
    transmission: {
        transmissionId: number;
        transmissionType: string;
    };
}

interface RentalResponse {
    rentalId: number;
    car: Car;
    customer: {
        userId: number;
        fullName: string;
        email: string;
        phoneNumber: string;
    };
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
}

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
            return response.data.data.rental;

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
    getRentDetailById : async (rentalId : number) =>{
        try {
            const response = await axiosToken.get(`${RENT_API}/${rentalId}`);
            const rental = response.data.data.rental as Rental;
            const car = await carsApi.getCarById(rental.car.carId);
            rental.car = car;
            return rental;
        } catch (error: any) {
            console.error('Get rentals error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi lấy giao dịch thuê xe');
        }
    },
    getRentalsByCustomer: async (customerId: number) => {
        try {
            const response = await axiosToken.get(`${RENT_API}/customer/${customerId}`);
            return response.data.data.rental;
        } catch (error: any) {
            console.error('Get rentals error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi lấy lịch sử thuê xe');
        }
    },
    getRentalsByOwner: async (ownerId: number) => {
        try {
            const response = await axiosToken.get(`${RENT_API}/owner/${ownerId}`);
            return response.data.data.rental;
        } catch (error: any) {
            console.error('Get rentals error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi lấy lịch sử thuê xe');
        }
    },
    approveRent : async (rentalId : number) => {
        try {
            const response = await axiosToken.post(`${RENT_API}/${rentalId}/approve`);
            return response.data.data.rental;
        } catch (error: any) {
            console.error('Get rentals error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi lấy lịch sử thuê xe');
        }
    },
    rejectRent : async (rentalId : number) => {
        try {
            const response = await axiosToken.post(`${RENT_API}/${rentalId}/reject`);
            return response.data.data.rental;
        } catch (error: any) {
            console.error('Get rentals error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi lấy lịch sử thuê xe');
        }
    },
    cancelRent : async (rentalId : number) => {
        try {
            const response = await axiosToken.post(`${RENT_API}/${rentalId}/cancel`);
            return response.data.data.rental;
        } catch (error: any) {
            console.error('Get rentals error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi lấy lịch sử thuê xe');
        }
    }
};

export default rentApi;