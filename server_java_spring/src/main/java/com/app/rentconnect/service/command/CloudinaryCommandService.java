package com.app.rentconnect.service.command;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import com.cloudinary.Cloudinary;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CloudinaryCommandService {
    Cloudinary cloudinary;

    public Map<String, Object> upload(MultipartFile file) {
        try {
            // Define transformation options for cropping and optimizing
            Map<String, Object> options = Map.of(
                    "transformation", Map.of(
                            "aspect_ratio", "1.3:1", // Crop to aspect ratio 1.3:1
                            "crop", "fill",         // Ensures the image is resized to fill the aspect ratio
                            "quality", "auto",      // Automatically adjusts quality for performance
                            "fetch_format", "auto"  // Optimizes format (e.g., WebP if supported)
                    )
            );

            // Upload the file with the defined transformation
            return cloudinary.uploader().upload(file.getBytes(), options);
        } catch (IOException io) {
            throw new RuntimeException("Image upload failed", io);
        }
    }
}
