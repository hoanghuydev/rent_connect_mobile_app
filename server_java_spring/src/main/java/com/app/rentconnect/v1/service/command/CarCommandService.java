package com.app.rentconnect.v1.service.command;

import com.app.rentconnect.v1.dto.car.request.CarLocationRequestDTO;
import com.app.rentconnect.v1.dto.car.request.CreateCarRequestDTO;
import com.app.rentconnect.v1.dto.car.response.CarResponseDTO;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.entity.*;
import com.app.rentconnect.v1.mapper.CarLocationMapper;
import com.app.rentconnect.v1.mapper.CarMapper;
import com.app.rentconnect.v1.repository.AmenityRepository;
import com.app.rentconnect.v1.repository.CarImageRepository;
import com.app.rentconnect.v1.repository.CarRepository;
import com.app.rentconnect.v1.repository.UserRepository;
import com.app.rentconnect.v1.service.query.AmenityQueryService;
import com.app.rentconnect.v1.service.query.CarQueryService;
import com.app.rentconnect.v1.util.SecurityUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

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
    UserRepository userRepository;
    AmenityRepository amenityRepository;
    CarLocationMapper carLocationMapper;
    CarImageRepository carImageRepository;


    public CarResponseDTO createCar(List<MultipartFile> imageFiles, CreateCarRequestDTO createCarRequestDTO) {
        Car car = carMapper.toEntity(createCarRequestDTO);

        //amenities
        List<Amenity> amenities = amenityRepository.findAllById(createCarRequestDTO.getAmenityIds());
        car.setAmenities(new HashSet<>(amenities));

        //Location car
        CarLocationRequestDTO carLocationRequestDTO = carLocationMapper.toCarLocationRequest(createCarRequestDTO);
        CarLocation carLocation = carLocationMapper.toEntity(carLocationRequestDTO);
        car.setLocation(carLocation);

        //Owner
        User user = SecurityUtil.getUserFromSecurityContext(userRepository);
        car.setOwner(user);

        car = carRepository.save(car);

        //Upload images car
        Set<CarImage> carImages = new HashSet<>();
        carImages = uploadCarImages(imageFiles);
        car.setImages(carImages);
        for (CarImage carImage : carImages) {
            carImage.setCar(new Car().builder().carId(car.getCarId()).build());
            carImageRepository.save(carImage);
        }
        List<String> imageUrls = carImages.stream()
                .map(CarImage::getImageUrl)
                .collect(Collectors.toList());

        CarResponseDTO carResponseDTO = carMapper.toCarResponseDTO(car);
        carResponseDTO.setImages(imageUrls);
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
            String imageId = (String) uploadResult.get("public_id");
            CarImage carImage = CarImage.builder()
                    .imageUrl(imageUrl)
                    .imageId(imageId)
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
