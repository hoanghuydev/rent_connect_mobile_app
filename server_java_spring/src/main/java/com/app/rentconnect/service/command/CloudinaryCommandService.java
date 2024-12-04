package com.app.rentconnect.service.command;

import com.cloudinary.utils.ObjectUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cloudinary.Cloudinary;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryCommandService {
    @Autowired
    private Cloudinary cloudinary;

    public Map<String, Object> upload(MultipartFile file) {
        try {
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
    public Map<String, Object> remove(String publicId) {
        try {
            // Sử dụng phương thức destroy để xóa ảnh với public_id
            return cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("invalidate", true));
        } catch (Exception e) {
            throw new RuntimeException("Image removal failed", e);
        }
    }
}
