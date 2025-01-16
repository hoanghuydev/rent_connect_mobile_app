import Rental from "@/models/Rental";
import {Text, TouchableOpacity, View} from "react-native";
import UserDetail from "@/models/UserDetail";
import rentApi from "@/api/rentApi";

const RentDetailAction = ({rent,user} : {rent : Rental,user :UserDetail})=>{
    async function approveRent() {
        const reponse = await rentApi.approveRent(rent.rentalId);
    }
    return <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        {rent.car.owner.userId==user.userId && rent.status=="REQUESTED" && <TouchableOpacity
            className="bg-green-500 rounded-xl py-4"
            onPress={approveRent}
        >
            <Text className="text-white text-center font-semibold">Chấp nhận</Text>
        </TouchableOpacity>}
    </View>

}
export default RentDetailAction