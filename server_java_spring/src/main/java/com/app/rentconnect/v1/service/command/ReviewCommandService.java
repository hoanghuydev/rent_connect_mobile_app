package com.app.rentconnect.v1.service.command;

import com.app.rentconnect.v1.dto.review.ReviewRequestDTO;
import com.app.rentconnect.v1.entity.Review;
import com.app.rentconnect.v1.repository.CarRepository;
import com.app.rentconnect.v1.repository.ReviewRepository;
import com.app.rentconnect.v1.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewCommandService {
    ReviewRepository reviewRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public int deleteReview(Long reviewId){
        return reviewRepository.markAsDeleted(reviewId);
    }

    public void addReview(Long carId, ReviewRequestDTO reviewRequestDTO){
        try {
            Review review = new Review();
            review.setCar(carRepository.findById(carId).get());
            review.setCustomer(userRepository.findById(reviewRequestDTO.getUserId()).get());
            review.setRating(reviewRequestDTO.getRating());
            review.setReviewText(reviewRequestDTO.getContent());

            reviewRepository.save(review);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
