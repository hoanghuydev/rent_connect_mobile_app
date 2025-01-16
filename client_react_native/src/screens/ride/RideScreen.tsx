import React, {useCallback, useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import { ChevronLeft, MapPin } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rentApi from '../../api/rentApi';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Rental from "@/models/Rental";
import {connectWebSocket, disconnectWebSocket} from "@/utils/webSocket";
import UserDetail from "@/models/UserDetail";
import {calculateTotalDays} from "@/utils/date";

const BookingHistoryScreen = () => {
    const navigation = useNavigation();
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user,setUser] = useState<UserDetail>()
    const handleUpdateRental = useCallback(async (data: Rental) => {
        setRentals(prev => {
            const existingIndex = prev.findIndex(rental => rental.rentalId === data.rentalId);
            if (existingIndex !== -1) {
                // Update existing rental
                const newRentals = [...prev];
                newRentals[existingIndex] = data;
                return newRentals;
            } else {
                // Add new rental
                return [data, ...prev];
            }
        });
    }, []);
    useFocusEffect(useCallback(() => {
        if (user) {
            const stompClient = connectWebSocket(user.userId,handleUpdateRental)

            return () => {
                disconnectWebSocket();
            };
        }
    }, [user]));

    useFocusEffect(
        useCallback(() => {
            loadRentals();
        }, [])
    );

    const loadRentals = async () => {
        try {
            setIsLoading(true);
            const userStr = await AsyncStorage.getItem('user');
            if (!userStr) throw new Error('Người dùng chưa đăng nhập');

            const user = JSON.parse(userStr);
            setUser(user);
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userRoles = payload.roles;
                let response;
                if (userRoles.includes('ROLE_OWNER')) {
                    response = await rentApi.getRentalsByOwner(user.userId);
                } else if (userRoles.includes('ROLE_CUSTOMER')) {
                    response = await rentApi.getRentalsByCustomer(user.userId);
                }
                console.log(response);
                setRentals(response);
            }

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
            case 'APPROVED':
                return 'Đã duyệt';
            case 'CANCELLED':
                return 'Đã hủy';
            case 'REJECTED':
                return 'Đã từ chối';
            case 'COMPLETED':
                return 'Hoàn thành';
            default:
                return status;
        }
    };



    const calculateTotalPrice = (pricePerDay: number, startDate: string, endDate: string) => {
        const days = calculateTotalDays(startDate, endDate);
        return pricePerDay * days;
    };


    const renderRentalItem = ({ item }: { item: Rental }) => (
        <View className="bg-white p-4 mb-3 rounded-lg shadow-sm" >
          <TouchableOpacity onPress={()=>navigation.navigate('RentDetail',{rentalId : item.rentalId})}>
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
          </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Content */}
            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#5fcf86" />
                </View>
            ) : error ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-red-500 text-center">{error}</Text>
                </View>
            ) : rentals.length === 0 ? (
                <View className="flex-1 justify-center items-center">
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