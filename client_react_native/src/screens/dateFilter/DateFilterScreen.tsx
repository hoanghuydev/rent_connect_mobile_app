import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import { ChevronLeft, X } from 'lucide-react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useNavigation } from "@react-navigation/native";

// Configure calendar locale (optional, but helpful for Vietnamese)
LocaleConfig.locales['vi'] = {
    monthNames: [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
        'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
        'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ],
    monthNamesShort: [
        'Th.1', 'Th.2', 'Th.3', 'Th.4',
        'Th.5', 'Th.6', 'Th.7', 'Th.8',
        'Th.9', 'Th.10', 'Th.11', 'Th.12'
    ],
    dayNames: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
    dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
};
LocaleConfig.defaultLocale = 'vi';

const DateFilterScreen = () => {
    const navigation = useNavigation();
    const primaryColor = '#5fcf86';
    const softGrayColor = '#E0E0E0';

    // States for date and time selection
    const [selectedRange, setSelectedRange] = useState<{
        startDate: string | null;
        endDate: string | null;
        startTime: string;
        endTime: string;
    }>({
        startDate: null,
        endDate: null,
        startTime: '10:00',
        endTime: '10:00'
    });

    // Function to calculate max date (4 months from now)
    const getMaxDate = () => {
        const today = new Date();
        const maxDate = new Date(today.getFullYear(), today.getMonth() + 4, today.getDate());
        return maxDate.toISOString().split('T')[0];
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center p-4">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <X size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold flex-1">Chọn ngày thuê</Text>
            </View>

            {/* Calendar Section */}
            <View className="flex-1">
                <Calendar
                    // Basic Configuration
                    minDate={new Date().toISOString().split('T')[0]}
                    maxDate={getMaxDate()}

                    // Range Selection
                    markingType={'period'}
                    markedDates={{
                        ...(selectedRange.startDate ? {
                            [selectedRange.startDate]: {
                                startingDay: true,
                                color: primaryColor,
                                textColor: 'white'
                            }
                        } : {}),
                        ...(selectedRange.endDate ? {
                            [selectedRange.endDate]: {
                                endingDay: true,
                                color: primaryColor,
                                textColor: 'white'
                            }
                        } : {})
                    }}

                    // Styling
                    theme={{
                        selectedDayBackgroundColor: primaryColor,
                        selectedDayTextColor: 'white',
                        todayTextColor: primaryColor,
                        arrowColor: primaryColor
                    }}

                    // Event Handlers
                    onDayPress={(day) => {
                        if (!selectedRange.startDate || selectedRange.endDate) {
                            setSelectedRange({
                                ...selectedRange,
                                startDate: day.dateString,
                                endDate: null
                            });
                        } else {
                            setSelectedRange({
                                ...selectedRange,
                                endDate: day.dateString
                            });
                        }
                    }}
                />
            </View>

            {/* Bottom Section */}
            <View className="p-4 border-t border-gray-200">
                {/* Time Selection Row */}
                <View className="flex-row space-x-4 mb-4">
                    <View className="flex-1">
                        <Text className="mb-2 text-gray-600">Giờ nhận xe</Text>
                        <TextInput
                            value={selectedRange.startTime}
                            onChangeText={(text) => setSelectedRange(prev => ({...prev, startTime: text}))}
                            mode="outlined"
                            keyboardType="numeric"
                            outlineColor={softGrayColor}
                            activeOutlineColor={primaryColor}
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="mb-2 text-gray-600">Giờ trả xe</Text>
                        <TextInput
                            value={selectedRange.endTime}
                            onChangeText={(text) => setSelectedRange(prev => ({...prev, endTime: text}))}
                            mode="outlined"
                            keyboardType="numeric"
                            outlineColor={softGrayColor}
                            activeOutlineColor={primaryColor}
                        />
                    </View>
                </View>

                {/* Selected Dates Display and Continue Button */}
                <View className="flex-row items-center">
                    <View className="flex-1">
                        <Text className="font-bold">
                            {selectedRange.startDate ? `${selectedRange.startTime}, ${selectedRange.startDate}` : 'Chưa chọn ngày'}
                            {' - '}
                            {selectedRange.endDate ? `${selectedRange.endTime}, ${selectedRange.endDate}` : 'Chưa chọn ngày'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        disabled={!selectedRange.startDate || !selectedRange.endDate}
                        className="p-3 rounded-full"
                        style={{
                            backgroundColor: selectedRange.startDate && selectedRange.endDate ? primaryColor : softGrayColor,
                            opacity: selectedRange.startDate && selectedRange.endDate ? 1 : 0.5
                        }}
                        onPress={() => {
                            // Handle continue action
                            console.log('Tiếp tục', selectedRange);
                        }}
                    >
                        <Text className="text-white">Tiếp tục</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default DateFilterScreen;