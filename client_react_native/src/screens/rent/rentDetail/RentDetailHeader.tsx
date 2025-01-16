import {Image, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {BlurView} from "expo-blur";
import {FontAwesome5} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import Rental from "@/models/Rental";

const RentDetailHeader = ({rent} : {rent : Rental})=>{
    const navigation = useNavigation();
    return <View className="absolute top-0 left-0 right-0 z-50">
        <View className="h-52 relative">
            <Image
                source={{ uri: rent.car.images[0] }}
                className="absolute top-0 left-0 right-0 bottom-0 w-full h-full"
                resizeMode="cover"
            />
            <BlurView
                intensity={80}
                tint="dark"
                className="absolute top-0 left-0 right-0 bottom-0"
            />
            <SafeAreaView className="z-10">
                <View className="px-4 pt-2 flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 bg-black/40 rounded-full items-center justify-center"
                    >
                        <FontAwesome5 name="chevron-left" size={18} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-lg font-semibold">Chi tiết thuê xe</Text>
                    <View className="w-10" />
                </View>
                <View className="px-4 mt-4">
                    <Text className="text-white text-2xl font-bold">{rent?.car.carName}</Text>
                    <Text className="text-white/80 mt-1">ID: {rent?.rentalId}</Text>
                </View>
            </SafeAreaView>
        </View>
    </View>
}
export default RentDetailHeader