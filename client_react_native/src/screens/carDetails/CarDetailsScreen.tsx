import {useEffect, useState} from "react";
import Car from "@/models/Car";
import carsApi from "@/api/carsApi";
import carImageApi from "@/api/carImageApi";
import {Bluetooth, Camera, Gauge, Heart, Navigation, Share2, Shield, Timer, Video, X} from "lucide-react-native";
import AmenityIcon from "@components/AmenityIcon";
import {useRoute} from "@react-navigation/native";
import {Text, View} from "react-native";
import MapView, {Marker} from "react-native-maps";

const CarDetailsScreen = () =>{
    const route = useRoute();
    const { carId } = route.params;
    const [carDetails,setCarDetails] = useState<Car>();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    async function getCarDetails() {
        const { data} = await carsApi.getCarDetails(carId);
        setCarDetails(data.car);
    }

    useEffect(() => {
        getCarDetails();
    }, []);
    if (!carDetails) {
        return <div className="p-4">Loading...</div>;
    }



    const specs = [
        {
            icon: <Timer className="w-6 h-6" />,
            value: carDetails.transmission.transmissionType
        },
        {
            icon: <Timer className="w-6 h-6" />,
            value: `${carDetails.seats} chỗ`
        },
        {
            icon: <Timer className="w-6 h-6" />,
            value: carDetails.fuel.fuelType
        },
        {
            icon: <Navigation className="w-6 h-6" />,
            value: carDetails.rangePerChargeOrTank
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

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white">
                <X className="w-6 h-6" />
                <h1 className="text-lg font-semibold">{carDetails.carName}</h1>
                <div className="flex gap-4">
                    <Share2 className="w-6 h-6" />
                    <Heart className="w-6 h-6" />
                </div>
            </div>

            {/* Car Image */}
            <div className="relative w-full h-64 bg-gray-200">
                <img
                    src={carDetails.images[currentImageIndex]}
                    alt="Car"
                    className="w-full h-full object-cover"
                />
                <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                >
                    ←
                </button>
                <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                >
                    →
                </button>
                <div className="absolute bottom-4 right-4 text-white bg-black/50 px-2 py-1 rounded">
                    {currentImageIndex + 1}/{carDetails.images.length}
                </div>
            </div>

            {/* Car Info */}
            <div className="p-4 bg-white">
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {specs.map((spec, index) => (
                        <div key={index} className="text-center flex flex-col justify-center items-center">
                            <div className="text-green-500 mb-2 w-fit">
                                {spec.icon}
                            </div>
                            <p className="text-sm font-bold w-fit">{spec.value}</p>
                        </div>
                    ))}
                </div>

                <h2 className="font-semibold mb-2">Mô tả</h2>
                <p className="text-gray-600 mb-4">{carDetails.description}</p>

                <h2 className="font-semibold mb-2">Các tiện nghi trên xe</h2>
                <div className="grid grid-cols-2 gap-4">
                    {carDetails.amenities.map((amenity) => (
                        <div key={amenity.amenityId} className="flex items-center gap-2 text-gray-600">
                            <AmenityIcon iconName={amenity.icon}/>
                            <span>{amenity.amenityName}</span>
                        </div>
                    ))}
                </div>

                <h2 className="font-semibold mt-4 mb-2">Vị trí xe</h2>
                <Text className="text-gray-600">
                    {`${carDetails.location.addressLine}, ${carDetails.location.ward}, ${carDetails.location.district}, ${carDetails.location.province}`}
                </Text>
                <View>
                    <MapView
                        initialRegion={{
                            latitude: carDetails.location.latitude,
                            longitude: carDetails.location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}>
                        <Marker coordinate={{ latitude: carDetails.location.latitude, longitude: carDetails.location.longitude }} />
                    </MapView>
                </View>
            </div>

            {/* Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <span className="text-green-500">{formatPrice(carDetails.pricePerDay)}/ngày</span>
                    </div>
                </div>
                <button className="w-full bg-green-500 text-white py-3 rounded-lg">
                    Chọn thuê
                </button>
            </div>
        </div>
    );
};

export default CarDetailsScreen;