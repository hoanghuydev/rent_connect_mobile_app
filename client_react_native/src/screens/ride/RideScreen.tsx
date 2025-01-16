import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, MapPin } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rentApi from '../../api/rentApi';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const BookingHistoryScreen = () => {
    const navigation = useNavigation();
    const [rentals, setRentals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadRentals();
    }, []);

    const loadRentals = async () => {
        try {
            setIsLoading(true);
            const userStr = await AsyncStorage.getItem('user');
            if (!userStr) throw new Error('Người dùng chưa đăng nhập');

            const user = JSON.parse(userStr);
            const response = await rentApi.getRentalsByCustomer(user.userId);
            setRentals(response);
        } catch (err: any) {
            console.error('Load rentals error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('vi-VN') + 'đ';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'REQUESTED':
                return '#FFA500';
            case 'CONFIRMED':
                return '#4CAF50';
            case 'CANCELLED':
                return '#FF0000';
            case 'COMPLETED':
                return '#2196F3';
            default:
                return '#666666';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'REQUESTED':
                return 'Đang chờ duyệt';
            case 'CONFIRMED':
                return 'Đã xác nhận';
            case 'CANCELLED':
                return 'Đã hủy';
            case 'COMPLETED':
                return 'Hoàn thành';
            default:
                return status;
        }
    };

    const calculateTotalDays = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const calculateTotalPrice = (pricePerDay: number, startDate: string, endDate: string) => {
        const days = calculateTotalDays(startDate, endDate);
        return pricePerDay * days;
    };


    const renderRentalItem = ({ item }: { item: any }) => (
        <View className="bg-white p-4 mb-3 rounded-lg shadow-sm">
            {/* Car Info Section */}
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                    <Text className="text-lg font-bold mb-1">{item.car.carName}</Text>
                    <View className="flex-row items-center">
                        <MapPin size={16} color="#666666" />
                        <Text className="text-gray-600 ml-1">
                            {item.car.location.district}, {item.car.location.province}
                        </Text>
                    </View>
                </View>
                <View className="items-end">
                    <Text className="text-primary font-bold">
                        {formatPrice(calculateTotalPrice(item.car.pricePerDay, item.startDate, item.endDate))}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                        {calculateTotalDays(item.startDate, item.endDate)} ngày
                    </Text>
                </View>
            </View>

            {/* Rental Details */}
            <View className="border-t border-gray-100 pt-3">
                <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Thời gian thuê:</Text>
                    <View>
                        <Text className="text-right">
                            Từ: {formatDate(item.startDate)}
                        </Text>
                        <Text className="text-right">
                            Đến: {formatDate(item.endDate)}
                        </Text>
                    </View>
                </View>

                {/* Amenities */}
                <View className="flex-row flex-wrap gap-2 mb-3">
                    {item.car.amenities.slice(0, 3).map((amenity: any) => (
                        <View
                            key={amenity.amenityId}
                            className="bg-gray-100 px-2 py-1 rounded-full"
                        >
                            <Text className="text-xs text-gray-600">
                                {amenity.amenityName}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Status and Date */}
                <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-gray-500 text-sm">
                        Ngày đặt: {formatDate(item.createdAt)}
                    </Text>
                    <View
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: getStatusColor(item.status) }}
                    >
                        <Text className="text-white text-sm font-medium">
                            {getStatusText(item.status)}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="absolute left-4 z-10"
                >
                    <ChevronLeft size={24} color="black" />
                </TouchableOpacity>

                <Text className="flex-1 text-center text-lg font-bold">
                    Rides
                </Text>
            </View>

            {/* Content */}
            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#5fcf86" />
                </View>
            ) : error ? (
                <View className="flex-1 justify-center items-center p-4">
                    <Text className="text-red-500 text-center">{error}</Text>
                </View>
            ) : rentals.length === 0 ? (
                <View className="flex-1 justify-center items-center p-4">
                    <Text className="text-gray-500 text-center">
                        Bạn chưa có lịch sử thuê xe nào
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={rentals}
                    renderItem={renderRentalItem}
                    keyExtractor={(item) => item.rentalId.toString()}
                    contentContainerClassName="p-4"
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

export default BookingHistoryScreen;