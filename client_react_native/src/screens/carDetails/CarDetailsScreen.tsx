import {useState} from "react";
import Car from "@/models/Car";
import carsApi from "@/api/carsApi";
import carImageApi from "@/api/carImageApi";

const CarDetailsScreen = () =>{
    const [carDetails,setCarDetails] = useState<Car>();
    async function getCarDetails() {
        // Id sẽ được truyền vào khi mở màn hình ( theo thực tế thì lưu ở đâu tối ưu)?
        const id;
        const {car} = await carsApi.getCarDetails(id);
        setCarDetails(car);
    }
}
export default CarDetailsScreen;