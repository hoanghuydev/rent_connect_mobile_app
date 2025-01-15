import {Image, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import Car from "@/models/Car";
import {primaryColor} from "@/utils/constant";
import {useNavigation} from "@react-navigation/native";
const CarItem = ({car, carImages} : {car : Car, carImages : { [key: number]: string[] }}) =>{
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            className="p-4 bg-white rounded-lg mb-3 shadow-sm border border-gray-100"
            onPress={() => {
                navigation.navigate('CarDetail', { carId : car.carId })
            }}
        >
            {/* Car Images */}
            {carImages[car.carId] && carImages[car.carId].length > 0 && (
                <View className="h-48 mb-4">
                    <Image
                        source={{ uri: carImages[car.carId][0] }}
                        className="w-full h-full rounded-lg"
                        resizeMode="cover"
                    />
                </View>
            )}

            {/* Car Info */}
            <View className="space-y-2">
                <Text className="text-lg font-bold">{car.carName}</Text>

                <View className="flex-row cars-center space-x-2">
                    <Text className="text-gray-600">
                        {car.location.district}, {car.location.province}
                    </Text>
                </View>

                <View className="flex-row cars-center space-x-4">
                    <Text className="text-gray-600">{car.transmission.transmissionType}</Text>
                    <Text className="text-gray-600"> {car.seats} chỗ</Text>
                </View>

                {/* Amenities */}
                <View className="flex-row flex-wrap gap-2">
                    {car.amenities.slice(0, 3).map((amenity) => (
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

                <Text className="text-primary font-bold text-lg" style={{ color: primaryColor }}>
                    {car.pricePerDay.toLocaleString('vi-VN')}đ/ngày
                </Text>
            </View>
        </TouchableOpacity>
    )
}
export default CarItem;