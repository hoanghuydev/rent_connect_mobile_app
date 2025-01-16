package com.app.rentconnect.v1.service.query;

import com.app.rentconnect.v1.dto.review.ReviewResponseDTO;
import com.app.rentconnect.v1.entity.Review;
import com.app.rentconnect.v1.entity.User;
import com.app.rentconnect.v1.repository.ReviewRepository;
import com.app.rentconnect.v1.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewQueryService {
    ReviewRepository reviewRepository;

    public List<ReviewResponseDTO> getReviewsByCarId(Long carId){
        List<Review> reviewList = reviewRepository.findByCar_CarId(carId);

        return reviewList.stream()
            .filter(review -> review.getDeletedAt() == null) // Kiểm tra deletedAt là null
            .map(review -> {
               ReviewResponseDTO dto = new ReviewResponseDTO();
               dto.setReviewId(review.getReviewId());
               dto.setRating(review.getRating());
               dto.setContent(review.getReviewText());
               dto.setCreatedAt(review.getCreatedAt());
               dto.setUserName(review.getCustomer().getFullName());
               dto.setUserId(review.getCustomer().getUserId());
               return dto;
            }).collect(Collectors.toList());
    }

}
