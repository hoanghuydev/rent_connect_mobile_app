import Rental from "@/models/Rental";
import {Text, View} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
const statusMap = {
    'REQUESTED': { text: 'Yêu cầu thuê', order: 1, icon: 'timer' },
    'APPROVED': { text: 'Đã chấp nhận', order: 2, icon: 'check-circle' },
    'COMPLETED': { text: 'Hoàn thành', order: 3, icon: 'verified' }
};
const ProgressStatus = ({rent} : {rent :Rental})=>{
    const currentStatus = rent?.status;
    const statuses = ['REQUESTED', 'APPROVED', 'COMPLETED'];
    const currentIdx = statuses.indexOf(currentStatus || '');

    return (
        <View className="p-4 mt-3 bg-white rounded-2xl shadow-sm">
            <Text className="text-lg font-semibold mb-4">Trạng thái thuê xe</Text>
            <View className="flex-row justify-between mb-2">
                {statuses.map((status, index) => (
                    <View key={status} className="items-center flex-1">
                        <View className={`w-10 h-10 rounded-full items-center justify-center ${
                            index <= currentIdx ? 'bg-green-500' : 'bg-gray-200'
                        }`}>
                            <MaterialIcons
                                name={statusMap[status].icon}
                                size={24}
                                color={index <= currentIdx ? 'white' : '#9CA3AF'}
                            />
                        </View>
                        <Text className="text-center mt-2 text-xs">{statusMap[status].text}</Text>
                    </View>
                ))}
            </View>
            <View className="h-1 bg-gray-200 mt-4 rounded-full">
                <View
                    className="h-1 bg-green-500 rounded-full"
                    style={{ width: `${(currentIdx / (statuses.length - 1)) * 100}%` }}
                />
            </View>
        </View>
    );
}
export default ProgressStatus