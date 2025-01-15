import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { LocationFilterScreenNavigationProp } from "@/navigation/type";
import { TextInput } from 'react-native-paper';
import { Search, MapPin, Calendar } from 'lucide-react-native';
import carsApi from '@/api/carsApi';
import carImageApi from '@/api/carImageApi';
import Car from "@/models/Car";
import CarItem from "@components/CarItem";
import {primaryColor, softGrayColor} from "@/utils/constant";



const ExploreScreen = () => {
    const navigation = useNavigation<LocationFilterScreenNavigationProp>();
    const [searchQuery, setSearchQuery] = useState('');
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [carImages, setCarImages] = useState<{ [key: number]: string[] }>({});

    const loadCarImages = async (carId: number) => {
        try {
            const images = await carImageApi.getImagesByCarId(carId);
            setCarImages(prev => ({
                ...prev,
                [carId]: images
            }));
        } catch (error) {
            console.error('Error loading car images:', error);
        }
    };

    useEffect(() => {
        loadCars();
    }, []);

    //load image
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
            console.log('Loading cars...'); // Debug log

            const response = await carsApi.getAllCars();
            console.log('Cars response:', response); // Debug log

            if (response && response.data && response.data.car) {
                setCars(response.data.car);
            } else {
                setError('Invalid data format');
            }
        } catch (err: any) {
            console.error('Load cars error:', err);
            setError(err.message || 'Có lỗi xảy ra khi tải danh sách xe');
        } finally {
            setIsLoading(false);
        }
    };


        return (
            <View className="flex-1 bg-gray-50">
                {/* Search Section */}
                <View className="p-4 bg-white">
                    <View className="flex-row items-center space-x-2 mb-4">
                        <View className="flex-1">
                            <TextInput
                                placeholder="Tìm kiếm xe..."
                                mode="outlined"
                                outlineColor={softGrayColor}
                                activeOutlineColor={primaryColor}
                                left={<TextInput.Icon icon={() => <Search size={20} color={primaryColor} />} />}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                        <TouchableOpacity
                            className="p-3 rounded-full"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <Search size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Filters */}
                    <View className="flex-row space-x-4">
                        <TouchableOpacity
                            className="flex-1 flex-row items-center p-3 rounded-lg border border-gray-200"
                            onPress={() => navigation.navigate('LocationFilter')}
                        >
                            <MapPin size={20} color={primaryColor} />
                            <View className="ml-2">
                                <Text className="text-xs text-gray-500">Địa điểm</Text>
                                <Text className="text-sm font-medium">Chọn địa điểm</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 flex-row items-center p-3 rounded-lg border border-gray-200"
                            onPress={() => navigation.navigate('DateFilter')}
                        >
                            <Calendar size={20} color={primaryColor} />
                            <View className="ml-2">
                                <Text className="text-xs text-gray-500">Thời gian</Text>
                                <Text className="text-sm font-medium">Chọn ngày</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

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
                            <CarItem car={item} carImages={carImages}  />
                        )}
                        keyExtractor={(item) => item.carId.toString()}
                        contentContainerClassName="p-4"
                        showsVerticalScrollIndicator={false}
                        refreshing={isLoading}
                        onRefresh={loadCars}
                        ListEmptyComponent={() => (
                            <View className="flex-1 justify-center items-center p-4">
                                <Text className="text-gray-500">Không tìm thấy xe nào</Text>
                            </View>
                        )}
                    />
                )}
            </View>
        );

};

export default ExploreScreen;