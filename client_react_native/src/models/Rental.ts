import Car from "@/models/Car";
import UserDetail from "@/models/UserDetail";
export default interface Rental {
    rentalId: number;
    car: Car;
    customer: UserDetail;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
    totalPrice : number;
    paid : boolean;
}