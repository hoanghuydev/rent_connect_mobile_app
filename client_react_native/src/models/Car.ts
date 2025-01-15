import Location from "@/models/Location";
import CarImage from "@/models/CarImage";
import Amenity from "@/models/Amenity";

export default interface Car {
    carId: number;
    carName: string;
    description: string;
    pricePerDay: number;
    images: CarImage;
    location: Location;
    transmission: {
        transmissionId: number;
        transmissionType: string;
    };
    seats: number;
    amenities: Amenity[];
    owner: {
        userId: number;
        fullName: string;
        email: string;
        phoneNumber: string;
    };
}