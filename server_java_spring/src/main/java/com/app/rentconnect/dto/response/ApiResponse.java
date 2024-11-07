package com.app.rentconnect.dto.response;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL) // Trả về JSON loại bỏ các trường NULL
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApiResponse<T> {
     int status;
     String message;
     Map<String, T> result;

    public ApiResponse(HttpStatus status, String message, String fieldName, T result) {
        this.status = status.value();
        this.message = message;
        this.result = new HashMap<>();
        this.result.put(fieldName, result);
    }
}
