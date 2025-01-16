import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Home, MessageSquare, Car, Headphones, User, Building2, FileCheck, Facebook, HelpCircle, FileText, Lock, CheckCircle } from 'lucide-react-native';

const SupportScreen = () => {
    const insuranceCompanies = [
        {
            id: 1,
            logo: 'https://inkythuatso.com/uploads/images/2021/11/mb-bank-logo-inkythuatso-01-10-09-01-10.jpg', // Replace with actual logo URL
            name: 'MIC'
        },
        {
            id: 2,
            logo: 'https://inkythuatso.com/uploads/images/2021/11/mb-bank-logo-inkythuatso-01-10-09-01-10.jpg', // Replace with actual logo URL
            name: 'INSURANCE'
        },
        {
            id: 3,
            logo: 'https://inkythuatso.com/uploads/images/2021/11/mb-bank-logo-inkythuatso-01-10-09-01-10.jpg', // Replace with actual logo URL
            name: 'VNI'
        }
    ];

    const infoItems = [
        { id: 1, icon: Building2, title: 'Thông tin công ty' },
        { id: 2, icon: FileCheck, title: 'Chính sách và quy định' },
        { id: 3, icon: Facebook, title: 'Đánh giá Rent Connect trên App Store' },
        { id: 4, icon: Facebook, title: 'Fanpage Facebook Mioto' },
        { id: 5, icon: HelpCircle, title: 'Hỏi và trả lời' },
        { id: 6, icon: FileText, title: 'Quy chế hoạt động' },
        { id: 7, icon: Lock, title: 'Bảo mật thông tin' },
        { id: 8, icon: CheckCircle, title: 'Giải quyết tranh chấp' },
    ];


    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView>
                {/* Support Center Header */}
                <View className="bg-green-50 p-6">
                    <Text className="text-2xl font-bold mb-4">Trung tâm hỗ trợ nhanh</Text>
                    <View className="bg-white rounded-lg p-4 shadow-sm">
                        <Text className="text-base mb-4">
                            Cần hỗ trợ nhanh vui lòng gọi 1900 9217 (7:00AM - 10:00PM) hoặc gửi tin nhắn vào Mioto Fanpage.
                        </Text>
                        <View className="flex-row space-x-4 gap-5">
                            <TouchableOpacity className="flex-1 border border-green-500 rounded-lg py-2 items-center">
                                <Text className="text-green-500">Gọi</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 bg-green-500 rounded-lg py-2 items-center">
                                <Text className="text-white">Gửi tin nhắn</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Insurance Hotlines */}
                <View className="bg-white p-6">
                    <Text className="text-lg font-semibold mb-4">Hotline Bảo hiểm</Text>
                    <View className="flex-row justify-between">
                        {insuranceCompanies.map((company) => (
                            <View key={company.id} className="w-24 h-24 border border-gray-200 rounded-lg items-center justify-center">
                                <Image
                                    source={{ uri: company.logo }}
                                    className="w-16 h-8"
                                    resizeMode="contain"
                                />
                                <Text className="text-sm mt-2">{company.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Information Grid */}
                <View className="bg-white p-6 mt-4">
                    <Text className="text-lg font-semibold mb-4">Thông tin</Text>
                    <View className="flex-row flex-wrap justify-between">
                        {infoItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    className="w-[48%] p-4 border border-gray-100 rounded-lg mb-4 items-center"
                                >
                                    <IconComponent size={24} color="#4CAF50" />
                                    <Text className="text-sm text-center mt-2">{item.title}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default SupportScreen;