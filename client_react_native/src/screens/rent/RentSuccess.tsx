import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Platform,
    Linking
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Check, Calendar, ArrowRight, Home } from 'lucide-react-native';
import {primaryColor, softGrayColor} from "@/utils/constant";
import paymentApi from "@/api/paymentApi";

interface RentalSuccessParams {
    carName: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    rentalId : number;
}

const RentalSuccessScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { carName, startDate, endDate, totalPrice,rentalId } = route.params as RentalSuccessParams;

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(price);
    };
    
    const handlePaymentMomo = async () =>{
        if (rentalId) {
            const urlMomo = await paymentApi.createMomoPayment(rentalId);
            Linking.openURL(urlMomo).catch((err) => {
                console.error('Error opening MoMo URL:', err);
            });
            navigation.navigate('Main')
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Success Icon */}
                <View style={styles.successIconContainer}>
                    <View style={styles.successIcon}>
                        <Check size={40} color="#fff" />
                    </View>
                </View>

                {/* Success Message */}
                <View style={styles.messageContainer}>
                    <Text style={styles.successTitle}>Đặt xe thành công!</Text>
                    <Text style={styles.successMessage}>
                        Cảm ơn bạn đã đặt thuê xe. Chi tiết đơn hàng của bạn như sau:
                    </Text>
                </View>

                {/* Rental Details */}
                <View style={styles.detailsCard}>
                    <Text style={styles.carName}>{carName}</Text>
                    
                    <View style={styles.dateContainer}>
                        <View style={styles.dateItem}>
                            <Calendar size={24} color="#00BFFF" />
                            <View style={styles.dateInfo}>
                                <Text style={styles.dateLabel}>Ngày bắt đầu</Text>
                                <Text style={styles.dateValue}>{formatDate(startDate)}</Text>
                            </View>
                        </View>

                        <ArrowRight size={24} color="#666" />

                        <View style={styles.dateItem}>
                            <Calendar size={24} color="#00BFFF" />
                            <View style={styles.dateInfo}>
                                <Text style={styles.dateLabel}>Ngày kết thúc</Text>
                                <Text style={styles.dateValue}>{formatDate(endDate)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Tổng tiền</Text>
                        <Text style={styles.priceValue}>{formatPrice(totalPrice)}</Text>
                    </View>
                </View>

                {/* Additional Information */}
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        Thông tin chi tiết về đơn hàng đã được gửi đến email của bạn.
                        Vui lòng kiểm tra email để xem hướng dẫn tiếp theo.
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={styles.bottomButtons}>
                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={handlePaymentMomo}
                >
                    <Home size={20} color="#fff" />
                    <Text style={styles.primaryButtonText}>Thanh toán</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => navigation.navigate('Main')}
                >
                    <Home size={20} color="#fff" />
                    <Text style={styles.primaryButtonText}>Về trang chủ</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9'
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 24
    },
    successIconContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 24
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    messageContainer: {
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 32
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333'
    },
    successMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24
    },
    detailsCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    carName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333'
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    dateItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    dateInfo: {
        marginLeft: 12,
        flex: 1
    },
    dateLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4
    },
    dateValue: {
        fontSize: 14,
        color: '#333'
    },
    priceContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 16,
        paddingTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    priceLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    priceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: primaryColor
    },
    infoContainer: {
        padding: 24
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20
    },
    bottomButtons: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee'
    },
    button: {
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    primaryButton: {
        backgroundColor: primaryColor
    },
    secondaryButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: primaryColor
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8
    },
    secondaryButtonText: {
        color: primaryColor,
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default RentalSuccessScreen;