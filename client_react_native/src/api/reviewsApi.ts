import { axiosNoToken } from './axios';

const REVIEW_API = '/review';

interface Review {
    reviewId: number;
    userName: string;
    userId: number;
    rating: number;
    content: string;
    createdAt: string;
}

interface ReviewsResponse {
    status: number;
    message: string;
    data: {
        reviews: Review[];
    };
}

interface AddReviewRequest {
    rating: number;
    userId: number;
    content: string;
}

interface AddReviewResponse {
    status: number;
    message: string;
    data?: Review; // data có thể không có trong response
}


const reviewsApi = {
    // Lấy danh sách reviews theo carId
    getReviewsByCarId: async (carId: number): Promise<Review[]> => {
        try {
            const response = await axiosNoToken.get<ReviewsResponse>(`${REVIEW_API}/${carId}`);

            console.log('Reviews Response:', response.data);

            if (response.data && response.data.status === 200) {
                return response.data.data.reviews;
            }

            return [];
        } catch (error: any) {
            console.error('Get reviews error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi lấy đánh giá');
        }
    },

    // Thêm review mới
    addReview: async (carId: number, reviewData: AddReviewRequest): Promise<boolean> => {
        try {
            const response = await axiosNoToken.post<AddReviewResponse>(
                `${REVIEW_API}/${carId}`,
                reviewData
            );

            console.log('Add review response:', response.data);

            // Kiểm tra status từ response
            if (response.data && response.status === 202) {
                return true; // Trả về true nếu thành công
            }

            throw new Error(response.data.message || 'Thêm đánh giá thất bại');

        } catch (error: any) {
            console.error('Add review error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm đánh giá');
        }
    },

    //delete
    deleteReview: async (reviewId: number) => {
        try {
            const response = await axiosNoToken.delete(`${REVIEW_API}/${reviewId}`);
            return response;
        } catch (error: any) {
            console.error('Delete review error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa đánh giá');
        }
    }

};

export default reviewsApi;