
import { useRoute, useNavigation } from "@react-navigation/native";
import {useCallback, useEffect, useState} from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Platform } from "react-native";
import Rental from "@/models/Rental";
import rentApi from "@/api/rentApi";
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import dayjs from 'dayjs';
import ProgressStatus from "@components/ProgressStatus";
import RentDetailHeader from "@/screens/rent/rentDetail/RentDetailHeader";
import UserInfo from "@components/UserInfo";
import RentDetailAction from "@/screens/rent/rentDetail/RentDetailAction";
import UserDetail from "@/models/UserDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {connectWebSocket, disconnectWebSocket} from "@/utils/webSocket";
import {calculateTotalDays} from "@/utils/date";



const RentDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { rentalId } = route.params;
    const [rent, setRent] = useState<Rental | null>(null);
    const [user,setUser] = useState<UserDetail>();
    const handleUpdateRental = useCallback(async (data: Rental) => {
        setRent((prev) => ({
            ...data,
            car: prev.car,
        }));
    }, []);


    useEffect(() => {
        if (user) {
            const stompClient = connectWebSocket(user.userId,handleUpdateRental)
            return () => {
                disconnectWebSocket();
            };
        }
    }, [user]);

    async function getRentDetail() {
        const rental = await rentApi.getRentDetailById(rentalId);
        setRent(rental);
    }
    async function getUserDetail() {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }

    useEffect(() => {
        getRentDetail();
        getUserDetail();
    }, [rentalId]);

    const formatPrice = (price: number) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
    };

    const formatDate = (date: string) => {
        return dayjs(date).format('DD/MM/YYYY HH:mm');
    };

    if (!rent) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-lg">Loading...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <RentDetailHeader rent={rent}/>

            <ScrollView className="flex-1 mt-52 ">
                <View className="px-4 space-y-4 flex flex-col gap-5">
                    {/* Progress Status */}
                    {<ProgressStatus rent={rent}/>}
                    {/* Customer Information */}
                    <UserInfo user={rent.customer} title={"Thông tin khách thuê"}/>

                    <UserInfo user={rent.car.owner} title={"Thông tin chủ xe"}/>

                    {/* Rental Information */}
                    <View className="bg-white p-4 rounded-2xl shadow-sm">
                        <Text className="text-lg font-semibold mb-3">Thông tin thuê xe</Text>

                        <View className="border-b border-gray-100 pb-3">
                            <Text className="text-gray-600 mb-1">Thời gian nhận xe</Text>
                            <Text className="font-medium">{formatDate(rent.startDate)}</Text>
                        </View>

                        <View className="border-b border-gray-100 py-3">
                            <Text className="text-gray-600 mb-1">Thời gian trả xe</Text>
                            <Text className="font-medium">{formatDate(rent.endDate)}</Text>
                        </View>

                        <View className="pt-3">
                            <Text className="text-gray-600 mb-1">Địa điểm</Text>
                            <Text className="font-medium">
                                {`${rent.car.location.addressLine}, ${rent.car.location.ward}, ${rent.car.location.district}, ${rent.car.location.province}`}
                            </Text>
                        </View>
                    </View>

                    {/* Price Details */}
                    <View className="bg-white p-4 rounded-2xl shadow-sm ">
                        <Text className="text-lg font-semibold mb-3">Bảng giá</Text>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-600">Giá thuê theo ngày</Text>
                            <Text className="font-medium">{formatPrice(rent.car.pricePerDay)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Số ngày thuê</Text>
                            <Text className="font-medium">
                                {calculateTotalDays(rent.startDate,rent.endDate)} ngày
                            </Text>
                        </View>
                        <View className="border-t border-gray-100 mt-3 pt-3">
                            <View className="flex-row justify-between">
                                <Text className="font-semibold">Tổng tiền</Text>
                                <Text className="font-semibold text-red-500">
                                    {formatPrice(rent.totalPrice)}
                                </Text>
                            </View>
                            {rent.paid && <View className="flex-row justify-between">
                                <Text className="font-semibold">Đã thanh toán</Text>
                                <Text className="font-semibold text-green-500">
                                    {formatPrice(rent.totalPrice)}
                                </Text>

                            </View>}
                        </View>
                    </View>
                    <View className="mb-24 flex">
                        {rent.status=="REQUESTED"&& <Text className="text-lg text-red-500 text-center">Hủy chuyến</Text>}
                    </View>
                </View>
            </ScrollView>
            <RentDetailAction rent={rent} user={user}/>
        </View>
    );
};

export default RentDetail;