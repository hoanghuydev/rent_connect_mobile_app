import {Role} from "@/models/Role";

export default interface UserDetail {
    roles: Role[];
    userId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    createdAt: Date;
    updatedAt: Date;
}