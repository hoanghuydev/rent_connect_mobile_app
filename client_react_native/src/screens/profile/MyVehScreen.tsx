import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import carsApi from '@/api/carsApi';
import carImageApi from '@/api/carImageApi';
import Car from "@/models/Car";
import CarItem from "@components/CarItem";
import { primaryColor } from "@/utils/constant";

const MyVehScreen = () => {
    const navigation = useNavigation();
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [carImages, setCarImages] = useState<{ [key: number]: string[] }>({});

    const loadCarImages = async (carId: number) => {
        try {
            const images = await carImageApi.getImagesByCarId(carId);
            setCarImages(prev => ({
                ...prev,
                [carId]: images,
            }));
        } catch (error) {
            console.error('Error loading car images:', error);
        }
    };

    useEffect(() => {
        loadCars();
    }, []);

    useEffect(() => {
        if (cars.length > 0) {
            cars.forEach(car => {
                if (!carImages[car.carId]) { // Chỉ load ảnh nếu chưa có
                    loadCarImages(car.carId);
                }
            });
        }
    }, [cars]);

    const loadCars = async () => {
        try {
            setIsLoading(true);
            setError(null);

            console.log('Loading cars owned by user...');
            const response = await carsApi.getCarsByOwner();
            console.log('Cars owned response:', response);

            if (response && response.data && response.data.cars) {
                setCars(response.data.cars);
            } else {
                setError('Invalid data format');
            }
        } catch (err: any) {
            console.error('Load cars error:', err);
            setError(err.message || 'Có lỗi xảy ra khi tải danh sách xe của bạn');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">

            {/* Cars List */}
            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={primaryColor} />
                </View>
            ) : error ? (
                <View className="flex-1 justify-center items-center p-4">
                    <Text className="text-red-500 text-center mb-4">{error}</Text>
                    <TouchableOpacity
                        className="px-4 py-2 bg-primary rounded-full"
                        style={{ backgroundColor: primaryColor }}
                        onPress={loadCars}
                    >
                        <Text className="text-white">Thử lại</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={cars}
                    renderItem={({ item }) => (
                        <CarItem car={item} carImages={carImages} />
                    )}
                    keyExtractor={(item) => item.carId.toString()}
                    contentContainerClassName="p-4"
                    showsVerticalScrollIndicator={false}
                    refreshing={isLoading}
                    onRefresh={loadCars}
                    ListEmptyComponent={() => (
                        <View className="flex-1 justify-center items-center p-4">
                            <Text className="text-gray-500">Bạn chưa có xe nào được thêm</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default MyVehScreen;
