import React, { useEffect, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView,
    Button, 
    ActivityIndicator,
    SafeAreaView
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Calendar } from "lucide-react-native";
import carsApi from "@/api/carsApi";
import Car from "@/models/Car";
import rentApi from '@/api/rentApi';
import {primaryColor, softGrayColor} from "@/utils/constant";

interface RentalData {
    carId: number;
    startDate: Date;
    endDate: Date;
}

const RentScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { carId } = route.params as { carId: number };
    const [carDetails, setCarDetails] = useState<Car | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState({ start: false, end: false });
    const [totalDays, setTotalDays] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);

    const getCarDetails = async () => {
        try {
            const { data } = await carsApi.getCarDetails(carId);
            setCarDetails(data.car);
            calculateTotal(startDate, endDate, data.car.pricePerDay);
        } catch (error) {
            console.error("Error fetching car details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCarDetails();
    }, []);

    const calculateTotal = (start: Date, end: Date, price: number) => {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setTotalDays(diffDays);
        setTotalPrice(diffDays * price);
    };

    const handleDateConfirm = (date: Date, isStart: boolean) => {
        if (isStart) {
            setStartDate(date);
            if (date > endDate) {
                setEndDate(date);
            }
        } else {
            setEndDate(date);
        }

        if (carDetails) {
            calculateTotal(isStart ? date : startDate, isStart ? endDate : date, carDetails.pricePerDay);
        }
        setDatePickerVisibility({ start: false, end: false });
    };

    const handleRentCar = async () => {
        try {
            setIsLoading(true);
    
            // Chuyển đổi startDate và endDate thành ISO string
            const isoStartDate = new Date(startDate).toISOString();
            const isoEndDate = new Date(endDate).toISOString();

            // Gọi API rentCar với các tham số đúng định dạng
            await rentApi.rentCar(carId, isoStartDate, isoEndDate);
    
            // Điều hướng đến màn hình RentSuccess sau khi thuê xe thành công
            navigation.navigate('RentSuccess', {
                carName: carDetails?.carName,
                startDate: isoStartDate,
                endDate: isoEndDate,
                totalPrice
            });
        } catch (error) {
              console.error("Error creating rental:", error);
              Alert.alert(
                  'Lỗi',
                  'Có lỗi xảy ra khi đặt xe. Vui lòng thử lại sau.'
              );
          } finally {
              setIsLoading(false);
          }
      };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", { 
            style: "currency", 
            currency: "VND" 
        }).format(price);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={primaryColor} />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!carDetails) {
        return (
            <View style={styles.errorContainer}>
                <Text>Unable to load car details. Please try again later.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container}>

                {/* Car Summary */}
                <View style={styles.carSummary}>
                    <Image
                        source={{ uri: carDetails.images[0] }}
                        style={styles.carImage}
                    />
                    <View style={styles.carInfo}>
                        <Text style={styles.carName}>{carDetails.carName}</Text>
                        <Text style={styles.pricePerDay}>
                            {formatPrice(carDetails.pricePerDay)}/ngày
                        </Text>
                    </View>
                </View>

                {/* Date Selection */}
                <View style={styles.dateSection}>
                    <Text style={styles.sectionTitle}>Thời gian thuê xe</Text>
                    
                    <TouchableOpacity 
                        style={styles.dateButton}
                        onPress={() => setDatePickerVisibility({ ...isDatePickerVisible, start: true })}
                    >
                        <Calendar size={24} color='#00BFFF' />
                        <View style={styles.dateInfo}>
                            <Text style={styles.dateLabel}>Ngày bắt đầu</Text>
                            <Text style={styles.dateValue}>
                                {startDate.toLocaleDateString('vi-VN')}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.dateButton}
                        onPress={() => setDatePickerVisibility({ ...isDatePickerVisible, end: true })}
                    >
                        <Calendar size={24} color='#00BFFF' />
                        <View style={styles.dateInfo}>
                            <Text style={styles.dateLabel}>Ngày kết thúc</Text>
                            <Text style={styles.dateValue}>
                                {endDate.toLocaleDateString('vi-VN')}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible.start}
                        mode="date"
                        date={startDate}
                        minimumDate={new Date()}
                        onConfirm={(date) => handleDateConfirm(date, true)}
                        onCancel={() => setDatePickerVisibility({ ...isDatePickerVisible, start: false })}
                    />

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible.end}
                        mode="date"
                        date={endDate}
                        minimumDate={startDate}
                        onConfirm={(date) => handleDateConfirm(date, false)}
                        onCancel={() => setDatePickerVisibility({ ...isDatePickerVisible, end: false })}
                    />
                </View>

                {/* Price Summary */}
                <View style={styles.priceSummary}>
                    <Text style={styles.sectionTitle}>Chi tiết giá</Text>
                    <View style={styles.priceRow}>
                        <Text>Đơn giá</Text>
                        <Text>{formatPrice(carDetails.pricePerDay)}/ngày</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text>Số ngày thuê</Text>
                        <Text>{totalDays} ngày</Text>
                    </View>
                    <View style={[styles.priceRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Tổng tiền</Text>
                        <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <View>
                    <Text style={styles.totalLabel}>Tổng cộng</Text>
                    <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
                </View>
                <Button 
                    title="Đặt xe" 
                    color={primaryColor} 
                    onPress={handleRentCar} 
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9"
    },
    carSummary: {
        backgroundColor: "#fff",
        padding: 16,
        flexDirection: "row",
        alignItems: "center"
    },
    carImage: {
        width: 100,
        height: 100,
        borderRadius: 8
    },
    carInfo: {
        marginLeft: 16,
        flex: 1
    },
    carName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8
    },
    pricePerDay: {
        fontSize: 16,
        color: {primaryColor}
    },
    dateSection: {
        backgroundColor: "#fff",
        padding: 16,
        marginTop: 16
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 16
    },
    dateButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginBottom: 12
    },
    dateInfo: {
        marginLeft: 12
    },
    dateLabel: {
        fontSize: 12,
        color: "#666"
    },
    dateValue: {
        fontSize: 16,
        marginTop: 4
    },
    priceSummary: {
        backgroundColor: "#fff",
        padding: 16,
        marginTop: 16
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        paddingTop: 12,
        marginTop: 12
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "bold"
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: primaryColor
    },
    bottomBar: {
        padding: 16,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#ddd"
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default RentScreen;
