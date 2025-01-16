import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { Bluetooth, Camera, Gauge, Heart, Navigation, Share2, Shield, Timer, Video, X } from 'lucide-react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Car from '@/models/Car';
import carsApi from '@/api/carsApi';
import AmenityIcon from "@components/AmenityIcon";

const CarDetailsScreen = () => {
    const route = useRoute();
    const { carId } = route.params;
    const [carDetails, setCarDetails] = useState<Car>();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigation = useNavigation();

    async function getCarDetails() {
        const { data } = await carsApi.getCarDetails(carId);
        setCarDetails(data.car);
    }

    useEffect(() => {
        getCarDetails();
    }, []);

    if (!carDetails) {
        return (
            <View className="p-4">
                <Text>Loading...</Text>
            </View>
        );
    }

    const specs = [
        {
            icon: <Timer size={24} color="#22C55E" />,
            value: carDetails.transmission.transmissionType,
            label: 'Truyền động'
        },
        {
            icon: <Timer size={24} color="#22C55E" />,
            value: `${carDetails.seats} chỗ`,
            label: 'Số ghế'
        },
        {
            icon: <Timer size={24} color="#22C55E" />,
            value: carDetails.fuel.fuelType,
            label: 'Nhiên liệu'
        },
        {
            icon: <Navigation size={24} color="#22C55E" />,
            value: carDetails.rangePerChargeOrTank,
            label: 'Tiêu hao'
        }
    ];

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === carDetails.images.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? carDetails.images.length - 1 : prev - 1
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };
    const goBack = ()=>{
        navigation.goBack();
    }


    return (
        <View className="flex-1 bg-gray-50 relative pt-8">
            <ScrollView>
                {/* Header */}
                <View className="flex-row items-center absolute z-40 top-0 left-0 right-0 justify-between p-4 bg-white">
                    <TouchableOpacity onPress={goBack}>
                        <X size={24} />
                    </TouchableOpacity>
                    <Text className="text-lg font-semibold">{carDetails.carName}</Text>
                    <View className="flex-row gap-4">
                        <TouchableOpacity>
                            <Share2 size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Heart size={24} />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Car Image */}
                <View className="relative w-full mt-16 h-64">
                    <Image
                        source={{ uri: carDetails.images[currentImageIndex] }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        onPress={handlePrevImage}
                        className="absolute left-2 top-1/2 bg-black/50 p-2 rounded-full"
                    >
                        <Text className="text-white">←</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleNextImage}
                        className="absolute right-2 top-1/2 bg-black/50 p-2 rounded-full"
                    >
                        <Text className="text-white">→</Text>
                    </TouchableOpacity>
                    <View className="absolute bottom-4 right-4 bg-black/50 px-2 py-1 rounded">
                        <Text className="text-white">
                            {currentImageIndex + 1}/{carDetails.images.length}
                        </Text>
                    </View>
                </View>

                <Text className={"ms-3 my-5 text-xl font-bold"}>{carDetails.carName}</Text>


                {/* Car Info */}
                <View className="p-4 bg-white mt-2">
                    {/* Specs */}
                    <Text className={"text-lg font-semibold mt-2"}>Đặc điểm</Text>
                    <View className="flex-row justify-between mb-6">
                        {specs.map((spec, index) => (
                            <View key={index} className="items-center">
                                <View className="mb-2">{spec.icon}</View>
                                <Text className="text-xs text-gray-500">{spec.label}</Text>
                                <Text className="text-sm font-bold mt-1">{spec.value}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Description */}
                    <Text className="font-semibold mb-2">Mô tả</Text>
                    <Text className="text-gray-600 mb-4">{carDetails.description}</Text>

                    {/* Amenities */}
                    <Text className="font-semibold mb-2">Các tiện nghi trên xe</Text>
                    <View className="flex-row flex-wrap text-gray-500">
                        {carDetails.amenities.map((amenity) => (
                            <View
                                key={amenity.amenityId}
                                className="w-1/2 flex-row items-center gap-2 mb-4"
                            >
                                <AmenityIcon iconName={amenity.icon}/>
                                <Text className="text-gray-600">{amenity.amenityName}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Location */}
                    <Text className="font-semibold mt-4 mb-2">Vị trí xe</Text>
                    <Text className="text-gray-600 mb-4">
                        {`${carDetails.location.addressLine}, ${carDetails.location.ward}, ${carDetails.location.district}, ${carDetails.location.province}`}
                    </Text>
                    <MapView
                        className="flex flex-1 h-screen w-full"
                        initialRegion={{
                            latitude: 37.78825,
                            longitude: -122.4324,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    />
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-green-500 font-semibold text-lg">
                        {formatPrice(carDetails.pricePerDay)}/ngày
                    </Text>
                </View>
                <TouchableOpacity className="w-full bg-green-500 p-3 rounded-lg items-center">
                    <Text className="text-white font-semibold">Chọn thuê</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CarDetailsScreen;