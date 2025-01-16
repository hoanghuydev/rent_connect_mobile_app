import {axiosToken} from "@/api/axios";
const MOMO_API = '/payment/momo';
const paymentApi = {
    createMomoPayment :  async (rentalId : number) => {
        try {
            const response = await axiosToken.post(`${MOMO_API}/rental/${rentalId}`);
            return response.data.data.url;
        } catch (error: any) {
            console.error('Get rentals error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo thanh toán');
        }
    },
}
export default paymentApi