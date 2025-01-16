import {Bluetooth, Camera, Gauge, Shield, Timer, Video} from "lucide-react-native";

const AmenityIcon = ({iconName} : {iconName :string}) => {
        switch (iconName) {
            case "bluetooth-b": return <Bluetooth className="text-gray-500 w-6 h-6" />;
            case "bag-shopping": return <Shield className="text-gray-500 w-6 h-6" />;
            case "gauge": return <Gauge className="text-gray-500 w-6 h-6" />;
            case "dashcube": return <Camera className="text-gray-500 w-6 h-6" />;
            case "video": return <Video className="text-gray-500 w-6 h-6" />;
            case "camera": return <Camera className="text-gray-500 w-6 h-6" />;
            default: return <Timer className="text-gray-500 w-6 h-6" />;
        }
}
export default AmenityIcon