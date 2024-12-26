package com.app.rentconnect.v1.service.command;

import com.app.rentconnect.v1.dto.car.request.CreateCarRequestDTO;
import com.app.rentconnect.v1.dto.car.response.CarResponseDTO;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.entity.Amenity;
import com.app.rentconnect.v1.entity.Car;
import com.app.rentconnect.v1.entity.CarFeature;
import com.app.rentconnect.v1.entity.CarImage;
import com.app.rentconnect.v1.mapper.CarMapper;
import com.app.rentconnect.v1.repository.CarRepository;
import com.app.rentconnect.v1.service.query.AmenityQueryService;
import com.app.rentconnect.v1.service.query.CarQueryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CarCommandService {
    static List<String> ALLOWED_EXTENSIONS = Arrays.asList("png", "jpg");
    static long MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    CarMapper carMapper;
    CarRepository carRepository;
    CarQueryService carQueryService;
    AmenityQueryService amenityQueryService;
    CloudinaryCommandService cloudinaryCommandService;

    public CarResponseDTO createCar(List<MultipartFile> imageFiles, CreateCarRequestDTO createCarRequestDTO) {
        Car car = carMapper.toEntity(createCarRequestDTO);

        // Set amenities data
        Set<Amenity> amenities = new HashSet<>();
        for (Long amenityId : createCarRequestDTO.getAmenityIds()) {
            Amenity amenity = amenityQueryService.findById(amenityId);
            amenities.add(amenity);
        }
        car.setAmenities(amenities);

        // Set feature car
//        Set<CarFeature> features = new HashSet<>();
//        for (Long featureId : createCarRequestDTO.getAmenityIds()) {
//            CarFeature carFeature = carFeatureQuery.findById(featureId);
//            features.add(carFeature);
//        }
//        car.setFeatures(features);

        //Upload images car
        Set<CarImage> carImages = new HashSet<>();
        carImages = uploadCarImages(imageFiles);
        car.setImages(carImages);


        car = carRepository.save(car);

        CarResponseDTO carResponseDTO = carMapper.toCarResponseDTO(Optional.of(car));
        return carResponseDTO;
    }

    private Set<CarImage> uploadCarImages(List<MultipartFile> imageFiles) {
        if (imageFiles.size()> 6) throw new RuntimeException("Cannot upload over 6 images each car");
        for (MultipartFile imageFile : imageFiles) {
            if (imageFile.getSize() > MAX_IMAGE_FILE_SIZE)
                throw new RuntimeException("Cannot upload image with size larger than 6MB");
            String originalFilename = imageFile.getOriginalFilename();
            if (originalFilename == null || !hasAllowedExtension(originalFilename))
                throw new RuntimeException("Invalid file type. Only PNG and JPG are allowed");
        }
        Set<CarImage> carImages = new HashSet<>();
        for (MultipartFile image : imageFiles) {
            Map<String, Object> uploadResult = cloudinaryCommandService.upload(image);
            String imageUrl = (String) uploadResult.get("url");
            CarImage carImage = CarImage.builder()
                    .imageUrl(imageUrl)
                    .build();
            carImages.add(carImage);
        }
        return carImages;
    }
    private boolean hasAllowedExtension(String filename) {
        String extension = getFileExtension(filename);
        return ALLOWED_EXTENSIONS.contains(extension.toLowerCase());
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex != -1 && dotIndex < filename.length() - 1) ? filename.substring(dotIndex + 1) : "";
    }
}
