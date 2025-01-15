import {Bluetooth, Camera, Gauge, Shield, Timer, Video} from "lucide-react-native";

const AmenityIcon = ({iconName} : {iconName :string}) => {
        switch (iconName) {
            case "bluetooth-b": return <Bluetooth className="w-6 h-6" />;
            case "bag-shopping": return <Shield className="w-6 h-6" />;
            case "gauge": return <Gauge className="w-6 h-6" />;
            case "dashcube": return <Camera className="w-6 h-6" />;
            case "video": return <Video className="w-6 h-6" />;
            case "camera": return <Camera className="w-6 h-6" />;
            default: return <Timer className="w-6 h-6" />;
        }
}
export default AmenityIcon