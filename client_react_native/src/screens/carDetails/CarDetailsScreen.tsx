import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Button, ActivityIndicator, SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { Bluetooth, Camera, Gauge, Heart, Navigation, Share2, Shield, Timer, X } from "lucide-react-native";
import AmenityIcon from "@components/AmenityIcon";
import carsApi from "@/api/carsApi";
import Car from "@/models/Car";

const CarDetailsScreen = () => {
    const route = useRoute();
    const { carId } = route.params;
    const [carDetails, setCarDetails] = useState<Car | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00BFFF" />
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
        { icon: <Timer size={24} color="#00BFFF" />, value: carDetails.transmission.transmissionType },
        { icon: <Gauge size={24} color="#00BFFF" />, value: `${carDetails.seats} chỗ` },
        { icon: <Shield size={24} color="#00BFFF" />, value: carDetails.fuel.fuelType },
        { icon: <Navigation size={24} color="#00BFFF" />, value: `${carDetails.rangePerChargeOrTank} km` },
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
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
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: carDetails.location.latitude,
                        longitude: carDetails.location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: carDetails.location.latitude,
                            longitude: carDetails.location.longitude,
                        }}
                    />
                </MapView>

                {/* Bottom Bar */}
                <View style={styles.bottomBar}>
                    <Text style={styles.price}>{formatPrice(carDetails.pricePerDay)}/ngày</Text>
                    <Button title="Chọn thuê" color="#00BFFF" onPress={() => {}} />
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
    price: { fontSize: 18, fontWeight: "bold", color: "#00BFFF" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default CarDetailsScreen;