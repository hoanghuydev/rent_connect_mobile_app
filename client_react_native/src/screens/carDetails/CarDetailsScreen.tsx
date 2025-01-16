import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Button, ActivityIndicator, SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/native";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import { Bluetooth, Camera, Gauge, Heart, Navigation, Share2, Shield, Timer, X } from "lucide-react-native";
import AmenityIcon from "@components/AmenityIcon";
import carsApi from "@/api/carsApi";
import Car from "@/models/Car";
import {useNavigation} from "@react-navigation/native";
import {primaryColor, softGrayColor} from "@/utils/constant";
import { Star , Trash2 } from 'lucide-react-native';
import reviewsApi from '@/api/reviewsApi';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput as RNTextInput } from 'react-native';
import { TextInput } from 'react-native-paper';
import {RootStackParamList} from "@/navigation/type";


interface Review {
    reviewId: number;
    userName: string;
    userId: number;
    rating: number;
    content: string;
    createdAt: string;
}

const CarDetailsScreen = () => {
    const navigation = useNavigation<RootStackParamList>();
    const route = useRoute();
    const { carId } = route.params;
    const [carDetails, setCarDetails] = useState<Car | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const primaryColor = '#5fcf86';
    const softGrayColor = '#E0E0E0';

    //review
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [reviewError, setReviewError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    //new review
    const [newReview, setNewReview] = useState({
            rating: 5,
            userId: 0,
            content: '',
        });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getCarDetails = async () => {
        try {
            const { data } = await carsApi.getCarDetails(carId);
            setCarDetails(data.car);
        } catch (error) {
            console.error("Error fetching car details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCarDetails();
    }, []);

    //get user from asyncstorage
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const userStr = await AsyncStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    setCurrentUserId(user.userId);
                    // Cập nhật userId trong newReview
                    setNewReview(prev => ({
                        ...prev,
                        userId: user.userId
                    }));
                }
            } catch (error) {
                console.error('Error getting current user:', error);
            }
        };

        getCurrentUser();
    }, []);


    //fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            if (!carDetails?.carId) return;

            setIsLoadingReviews(true);
            setReviewError(null);

            try {
                const reviewsData = await reviewsApi.getReviewsByCarId(carDetails.carId);
                setReviews(reviewsData);
            } catch (error: any) {
                setReviewError(error.message);
                console.error('Error fetching reviews:', error);
            } finally {
                setIsLoadingReviews(false);
            }
        };

        fetchReviews();
    }, [carDetails?.carId]);

    //delete function
    const handleDeleteReview = async (reviewId: number) => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa đánh giá này?',
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await reviewsApi.deleteReview(reviewId);
                            // Cập nhật lại danh sách reviews sau khi xóa
                            setReviews(reviews.filter(review => review.reviewId !== reviewId));
                            Alert.alert('Thành công', 'Đã xóa đánh giá');
                        } catch (error: any) {
                            Alert.alert('Lỗi', error.message);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    //add review function
    const handleSubmitReview = async () => {
        if (!carDetails?.carId) return;
        if (!currentUserId) {
            Alert.alert('Lỗi', 'Vui lòng đăng nhập để thêm đánh giá');
            return;
        }
        if (!newReview.content.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập nội dung đánh giá');
            return;
        }

        setIsSubmitting(true);
        try {
            const reviewData = {
                ...newReview,
                userId: currentUserId
            };

            const success = await reviewsApi.addReview(carDetails.carId, reviewData);

            if (success) {
                // Refresh lại danh sách reviews
                const updatedReviews = await reviewsApi.getReviewsByCarId(carDetails.carId);
                setReviews(updatedReviews);

                // Reset form
                setNewReview({
                    rating: 5,
                    userId: currentUserId,
                    content: '',
                });

                Alert.alert('Thành công', 'Đã thêm đánh giá của bạn');
            }
        } catch (error: any) {
            Alert.alert('Lỗi', error.message);
        } finally {
            setIsSubmitting(false);
        }
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

    const specs = [
        { icon: <Timer size={24} color={primaryColor} />, value: carDetails.transmission.transmissionType },
        { icon: <Gauge size={24} color={primaryColor} />, value: `${carDetails.seats} chỗ` },
        { icon: <Shield size={24} color={primaryColor} />, value: carDetails.fuel.fuelType },
        { icon: <Navigation size={24} color={primaryColor} />, value: `${carDetails.rangePerChargeOrTank} km` },
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    //star in reviews
    const renderStars = (rating: number) => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        color={star <= rating ? "#FFD700" : "#E0E0E0"}
                        fill={star <= rating ? "#FFD700" : "#E0E0E0"}
                    />
                ))}
            </View>
        );
    };

    const renderReviewItem = (review: Review) => (
        <View key={review.reviewId} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>{review.userName}</Text>
                    <Text style={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                </View>

                {/* Nút xóa - chỉ hiển thị nếu là review của user hiện tại */}
                {currentUserId === review.userId && (
                    <TouchableOpacity
                        onPress={() => handleDeleteReview(review.reviewId)}
                        style={styles.deleteButton}
                    >
                        <Trash2 size={18} color="red" />
                    </TouchableOpacity>
                )}
            </View>
            {renderStars(review.rating)}
            <Text style={styles.reviewContent}>{review.content}</Text>
        </View>
    );


    return (
        <SafeAreaView style={{ flex: 1, paddingTop: 50 }}>
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <X size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.carName}>{carDetails.carName}</Text>
                    <View style={styles.headerIcons}>
                    <TouchableOpacity>
                        <X size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.carName}>{carDetails.carName}</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity>
                            <Share2 size={24} color="#333" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Heart size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
                </View>

                {/* Car Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: carDetails.images[currentImageIndex] }}
                        style={styles.image}
                    />
                    <TouchableOpacity
                        onPress={() =>
                            setCurrentImageIndex((prev) =>
                                prev === 0 ? carDetails.images.length - 1 : prev - 1
                            )
                        }
                        style={styles.prevButton}
                    >
                        <Text style={styles.arrow}>←</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            setCurrentImageIndex((prev) =>
                                prev === carDetails.images.length - 1 ? 0 : prev + 1
                            )
                        }
                        style={styles.nextButton}
                    >
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* Specs */}
                <View style={styles.specsContainer}>
                    {specs.map((spec, index) => (
                        <View key={index} style={styles.specItem}>
                            {spec.icon}
                            <Text style={styles.specText}>{spec.value}</Text>
                        </View>
                    ))}
                </View>

                {/* Description */}
                <Text style={styles.sectionTitle}>Mô tả</Text>
                <Text style={styles.description}>{carDetails.description}</Text>

                {/* Amenities */}
                <Text style={styles.sectionTitle}>Các tiện nghi trên xe</Text>
                <View style={styles.amenitiesContainer}>
                    {carDetails.amenities.map((amenity) => (
                        <View key={amenity.amenityId} style={styles.amenityItem}>
                            <AmenityIcon iconName={amenity.icon} />
                            <Text>{amenity.amenityName}</Text>
                        </View>
                    ))}
                </View>

                {/* Location */}
                <Text style={styles.sectionTitle}>Vị trí xe</Text>
                <Text>{`${carDetails.location.addressLine}, ${carDetails.location.ward}, ${carDetails.location.district}, ${carDetails.location.province}`}</Text>
                {/*<MapView*/}
                {/*    style={styles.map}*/}
                {/*    provider={PROVIDER_GOOGLE}*/}
                {/*    initialRegion={{*/}
                {/*        latitude: carDetails.location.latitude,*/}
                {/*        longitude: carDetails.location.longitude,*/}
                {/*        latitudeDelta: 0.01,*/}
                {/*        longitudeDelta: 0.01,*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <Marker*/}
                {/*        coordinate={{*/}
                {/*            latitude: carDetails.location.latitude,*/}
                {/*            longitude: carDetails.location.longitude,*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</MapView>*/}


            {/* review */}
            <View style={styles.reviewsSection}>
                <Text style={styles.sectionTitle}>Đánh giá</Text>

                {/* Existing reviews list */}
                {isLoadingReviews ? (
                    <ActivityIndicator size="small" color={primaryColor} />
                ) : reviewError ? (
                    <Text style={styles.errorText}>{reviewError}</Text>
                ) : (
                    <View style={styles.reviewsContainer}>
                        {reviews.map(renderReviewItem)}
                    </View>
                )}

                {/* Add Review Form */}
                {currentUserId && (  // Chỉ hiển thị form khi đã đăng nhập
                    <View style={styles.addReviewForm}>
                        <Text style={styles.formTitle}>Thêm đánh giá của bạn</Text>

                        {/* Rating Selection */}
                        <View style={styles.ratingSelector}>
                            <Text style={styles.ratingLabel}>Đánh giá:</Text>
                            <View style={styles.starsInput}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity
                                        key={star}
                                        onPress={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                    >
                                        <Star
                                            size={24}
                                            color={star <= newReview.rating ? "#FFD700" : "#E0E0E0"}
                                            fill={star <= newReview.rating ? "#FFD700" : "#E0E0E0"}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Review Content Input */}
                        <TextInput
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            placeholder="Nhập đánh giá của bạn..."
                            value={newReview.content}
                            onChangeText={(text) => setNewReview(prev => ({ ...prev, content: text }))}
                            style={styles.reviewInput}
                            outlineColor="#E0E0E0"
                            activeOutlineColor={primaryColor}
                        />

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                { opacity: isSubmitting ? 0.7 : 1 }
                            ]}
                            onPress={handleSubmitReview}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {!currentUserId && (
                    <View style={styles.loginPrompt}>
                        <Text style={styles.loginPromptText}>
                            Vui lòng đăng nhập để thêm đánh giá
                        </Text>
                    </View>
                )}
            </View>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <Text style={styles.price}>{formatPrice(carDetails.pricePerDay)}/ngày</Text>
                <Button title="Chọn thuê" color={primaryColor} onPress={() => {navigation.navigate('RentScreen', { carId })}} />
            </View>
        </ScrollView>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9f9f9" },
    header: { flexDirection: "row", justifyContent: "space-between", padding: 16, backgroundColor: "#fff" },
    carName: { fontSize: 18, fontWeight: "bold" },
    headerIcons: { flexDirection: "row", gap: 16 },
    imageContainer: { position: "relative", height: 200 },
    image: { width: "100%", height: "100%", resizeMode: "cover" },
    prevButton: { position: "absolute", left: 10, top: "50%", backgroundColor: "#00000088", padding: 8 },
    nextButton: { position: "absolute", right: 10, top: "50%", backgroundColor: "#00000088", padding: 8 },
    arrow: { color: "#fff", fontSize: 20 },
    specsContainer: { flexDirection: "row", justifyContent: "space-around", padding: 16, backgroundColor: "#fff" },
    specItem: { alignItems: "center" },
    specText: { marginTop: 4, fontSize: 14, color: "#333" },
    sectionTitle: { fontSize: 16, fontWeight: "bold", padding: 16 },
    description: { padding: 16, color: "#555" },
    amenitiesContainer: { flexDirection: "row", flexWrap: "wrap", padding: 16 },
    amenityItem: { flexDirection: "row", alignItems: "center", marginRight: 16 },
    map: { height: 200, marginVertical: 16 },
    bottomBar: { padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    price: { fontSize: 18, fontWeight: "bold", color: "#000" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    reviewsContainer: {
        padding: 16,
        backgroundColor: '#fff',
    },
    reviewItem: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    reviewDate: {
        fontSize: 12,
        color: '#666',
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 8,
        gap: 4,
    },
    reviewContent: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
    addReviewForm: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    formTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    ratingSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingLabel: {
        marginRight: 12,
        fontSize: 14,
        color: '#444',
    },
    starsInput: {
        flexDirection: 'row',
        gap: 8,
    },
    reviewInput: {
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    submitButton: {
        backgroundColor: '#5fcf86',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginPrompt: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        alignItems: 'center',
    },
    loginPromptText: {
        color: '#666',
        fontSize: 14,
    },
});

export default CarDetailsScreen;