package com.app.rentconnect.v1.service.query;

import com.app.rentconnect.v1.entity.CarImage;
import com.app.rentconnect.v1.repository.CarImageRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CarImageQueryService {
    CarImageRepository carImageRepository;

    public List<String> findAllByCarId(Long id) {
        List<CarImage> carImages = carImageRepository.findByCar_CarId(id);
        List<String> list = carImages.stream()
                .map(CarImage::getImageUrl) // Lấy trường imageUrl từ từng đối tượng CarImage
                .toList();
        return list;
    }
    public List<String> findAll() {
        List<CarImage> carImages = carImageRepository.findAll();
        List<String> list = carImages.stream()
                .map(CarImage::getImageUrl) // Lấy trường imageUrl từ từng đối tượng CarImage
                .toList();
        return list;
    }
}
