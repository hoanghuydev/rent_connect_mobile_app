import Location from "@/models/Location";
import CarImage from "@/models/CarImage";
import Amenity from "@/models/Amenity";
import Fuel from "@/models/Fuel";
import Transmission from "@/models/Transmission";
import UserDetail from "@/models/UserDetail";

export default interface Car {
    carId: number;
    carName: string;
    description: string;
    pricePerDay: number;
    images: CarImage;
    location: Location;
    transmission: Transmission;
    rangePerChargeOrTank : string;
    fuel : Fuel;
    seats: number;
    amenities: Amenity[];
    owner: UserDetail;
}