import UserDetail from "@/models/UserDetail";
import {Text, View} from "react-native";
import {FontAwesome5} from "@expo/vector-icons";

const UserInfo = ({user,title} : {user :UserDetail,title : string}) =>{
    return <View className="bg-white p-4 rounded-2xl shadow-sm">
        <Text className="text-lg font-semibold mb-3">{title}</Text>
        <View className="flex-row items-center">
            <FontAwesome5 name="user-circle" size={44} color="#4B5563" />
            <View className="ml-3">
                <Text className="font-medium text-base">{user.fullName}</Text>
                <Text className="text-gray-600">{user.phoneNumber ?? 'Chưa có số điện thoại'}</Text>
                <Text className="text-gray-600">{user.email}</Text>
            </View>
        </View>
    </View>
}
export default UserInfo