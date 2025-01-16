
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, MapPin } from 'lucide-react-native';

// Vietnamese provinces list (to simulate API data)
const VIETNAMESE_PROVINCES = [
    "An Giang", "Bà Rịa-Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
    "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
    "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng",
    "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp",
    "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh",
    "Hải Dương", "Hải Phòng", "Hậu Giang", "Hồ Chí Minh", "Hòa Bình",
    "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
    "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
    "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên",
    "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
    "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
    "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang",
    "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

const LocationFilterScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProvinces, setFilteredProvinces] = useState(VIETNAMESE_PROVINCES);

    // Filter provinces based on search query
    useEffect(() => {
        if (searchQuery) {
            const filtered = VIETNAMESE_PROVINCES.filter(province =>
                province.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProvinces(filtered);
        } else {
            setFilteredProvinces(VIETNAMESE_PROVINCES);
        }
    }, [searchQuery]);

    const handleSelectProvince = (province: string) => {
        // Trả về province đã chọn khi navigate back
        navigation.navigate('Main', {
            screen: 'Explore',
            params: { selectedLocation: province }
        });
    };

    // Render individual province item
    const renderProvinceItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            className="p-4 border-b border-gray-200"
            onPress={() => handleSelectProvince(item)}
        >
            <Text>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-200">
                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="absolute left-4"
                >
                    <ChevronLeft size={24} color="black" />
                </TouchableOpacity>

                {/* Title */}
                <Text className="flex-1 text-center text-lg font-bold">
                    Chọn địa điểm
                </Text>
            </View>

            {/* Search Input */}
            <View className="p-4">
                <TextInput
                    left={<TextInput.Icon icon={() => <MapPin size={20} color="#5fcf86" />} />}
                    placeholder="Nhập tỉnh/thành phố"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    mode="outlined"
                    outlineColor="#E0E0E0"
                    activeOutlineColor="#5fcf86"
                />
            </View>

            {/* Provinces List */}
            <FlatList
                data={filteredProvinces}
                renderItem={renderProvinceItem}
                keyExtractor={(item) => item}
                ListEmptyComponent={() => (
                    <View className="items-center p-4">
                        <Text className="text-gray-500">Không tìm thấy tỉnh/thành phố</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default LocationFilterScreen;