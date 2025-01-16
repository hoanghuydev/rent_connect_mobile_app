import {axiosNoToken} from "@/api/axios";
const USER_API = '/user'
export const userApi = {
    updateUser : async ({fullName,phoneNumber,userId}) =>{
        try {
            const response = await axiosNoToken.put(`${USER_API}/update/${userId}`, {
                fullName,
                phoneNumber
            });

            const apiResponse = response.data;
            console.log('Register response:', apiResponse);

            if (apiResponse.data.user) {
                return apiResponse.data.user;
            }
            return null;
        } catch (error: any) {
            console.error('Register error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
        }
    },
    getUserById : async (userId) =>{
        try {
            const response = await axiosNoToken.get(`${USER_API}/${userId}`);

            const apiResponse = response.data;
            console.log('Register response:', apiResponse.data);

            if (apiResponse.data.user) {
                return apiResponse.data.user
            }
            return null;

        } catch (error: any) {
            console.error('Register error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra lấy thông tin');
        }
    }
}