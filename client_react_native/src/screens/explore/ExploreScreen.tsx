import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Image } from 'react-native';
import { useNavigation , useFocusEffect, useRoute } from "@react-navigation/native";
import { LocationFilterScreenNavigationProp } from "@/navigation/type";
import { TextInput } from 'react-native-paper';
import { Search, MapPin, Calendar, X } from 'lucide-react-native';
import carsApi from '@/api/carsApi';
import carImageApi from '@/api/carImageApi';
import { Keyboard } from 'react-native';

interface Car {
    carId: number;
    carName: string;
    description: string;
    pricePerDay: number;
    images: string[];
    location: {
        addressLine: string;
        province: string;
        district: string;
        ward: string;
        latitude: number;
        longitude: number;
    };
    transmission: {
        transmissionId: number;
        transmissionType: string;
    };
    seats: number;
    amenities: {
        amenityId: number;
        amenityName: string;
        icon: string;
    }[];
    owner: {
        userId: number;
        fullName: string;
        email: string;
        phoneNumber: string;
    };
}

const ExploreScreen = () => {
    const navigation = useNavigation<LocationFilterScreenNavigationProp>();
    const route = useRoute();
    const primaryColor = '#5fcf86';
    const softGrayColor = '#E0E0E0';

    const [searchQuery, setSearchQuery] = useState('');
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [carImages, setCarImages] = useState<{ [key: number]: string[] }>({});

    //search object
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>('');


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

     useFocusEffect(
        React.useCallback(() => {
            // Reset search query và filtered cars
            setSearchQuery('');
            setFilteredCars(cars);
        }, [cars])
    );

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

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredCars(cars);
        } else {
            const filtered = cars.filter(car =>
                car.carName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.location.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.location.district.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCars(filtered);
        }
    }, [searchQuery, cars]);

   // Xử lý params khi quay lại từ LocationFilterScreen
    useEffect(() => {
            if (route.params?.selectedLocation) {
                const location = route.params.selectedLocation;
                setSelectedLocation(location);
                // Lọc xe theo địa điểm chính xác
                const filtered = cars.filter(car =>
                    car.location.province.toLowerCase()=== location.toLowerCase() // Sử dụng so sánh chính xác thay vì includes
                );
                setFilteredCars(filtered);
            }
        }, [route.params?.selectedLocation, cars]);

    const loadCars = async () => {
        try {
            setIsLoading(true);
            setError(null);
            console.log('Loading cars...'); // Debug log

            const response = await carsApi.getAllCars();
            console.log('Cars response:', response); // Debug log

            if (response && response.data && response.data.car) {
                setCars(response.data.car);
                setFilteredCars(response.data.car);
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

    const handleSearch = () => {
        // Đóng bàn phím
        Keyboard.dismiss();
        console.log("a");
        let filtered = [...cars];

        // Nếu có địa điểm được chọn, lọc theo địa điểm trước
        if (selectedLocation) {
            filtered = filtered.filter(car =>
                car.location.province === selectedLocation
            );
        }

        if (searchQuery.trim() !== '') {
            filtered = filtered.filter(car =>
                car.carName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.location.district.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
    };
    const handleClearLocation = () => {
        setSelectedLocation('');
        setSearchQuery('');
        setFilteredCars(cars);
    };


    const renderCarItem = ({ item }: { item: Car }) => (
        <TouchableOpacity
            className="p-4 bg-white rounded-lg mb-3 shadow-sm border border-gray-100"
            onPress={() => {
                console.log('Selected car:', item.carId);
            }}
        >
            {/* Car Images */}
            {carImages[item.carId] && carImages[item.carId].length > 0 && (
                <View className="h-48 mb-4">
                    <Image
                        source={{ uri: carImages[item.carId][0] }}
                        className="w-full h-full rounded-lg"
                        resizeMode="cover"
                    />
                </View>
            )}

            {/* Car Info */}
            <View className="space-y-2">
                <Text className="text-lg font-bold">{item.carName}</Text>

                <View className="flex-row items-center space-x-2">
                    <Text className="text-gray-600">
                        {item.location.district}, {item.location.province}
                    </Text>
                </View>

                <View className="flex-row items-center space-x-4">
                    <Text className="text-gray-600">{item.transmission.transmissionType}</Text>
                    <Text className="text-gray-600"> {item.seats} chỗ</Text>
                </View>

                {/* Amenities */}
                <View className="flex-row flex-wrap gap-2">
                    {item.amenities.slice(0, 3).map((amenity) => (
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
                    {item.pricePerDay.toLocaleString('vi-VN')}đ/ngày
                </Text>
            </View>
        </TouchableOpacity>
    )

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
                                onSubmitEditing={handleSearch}
                            />
                        </View>
                        <TouchableOpacity
                            className="p-3 rounded-full"
                            style={{ backgroundColor: primaryColor }}
                            onPress={handleSearch}
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
                            <View className="ml-2 flex-1">
                                <Text className="text-xs text-gray-500">Địa điểm</Text>
                                <Text className="text-sm font-medium">
                                    {selectedLocation || 'Chọn địa điểm'}
                                </Text>
                            </View>
                            {selectedLocation && (
                                <TouchableOpacity
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        handleClearLocation();
                                    }}
                                >
                                    <X size={20} color={softGrayColor} />
                                </TouchableOpacity>
                            )}
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
                        data={filteredCars}
                        renderItem={renderCarItem}
                        keyExtractor={(item) => item.carId.toString()}
                        contentContainerClassName="p-4"
                        showsVerticalScrollIndicator={false}
                        refreshing={isLoading}
                        onRefresh={loadCars}
                        ListEmptyComponent={() => (
                            <View className="flex-1 justify-center items-center p-4">
                                <Text className="text-gray-500">
                                    {searchQuery.trim() ? 'Không tìm thấy xe phù hợp' : 'Không tìm thấy xe nào'}
                                </Text>
                            </View>
                        )}
                    />
                )}
            </View>
        );

};

export default ExploreScreen;