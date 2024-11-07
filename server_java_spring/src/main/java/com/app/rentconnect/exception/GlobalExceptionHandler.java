package com.app.rentconnect.exception;


import com.app.rentconnect.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice // Annotation để đánh dấu lớp này là nơi xử lý ngoại lệ chung cho toàn bộ ứng dụng.
public class GlobalExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class) // Đánh dấu phương thức này xử lý ngoại lệ IllegalArgumentException.
    public ResponseEntity<ApiResponse<String>> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        ApiResponse<String> apiResponse = new ApiResponse<>(
                HttpStatus.BAD_REQUEST,
                "Invalid Argument",
                "error", ex.getMessage()
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<String>> handleAllExceptions(RuntimeException ex, WebRequest request) {
        ApiResponse<String> apiResponse = new ApiResponse<>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal Server Error",
                "error", "An unexpected error occurred."
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        StringBuilder errorMessage = new StringBuilder("Validation error: ");
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errorMessage.append(error.getField()).append(" - ").append(error.getDefaultMessage()).append(", ")
        );
        String finalMessage = errorMessage.substring(0, errorMessage.length() - 2); // Remove trailing comma and space

        ApiResponse<String> apiResponse = new ApiResponse<>(
                HttpStatus.BAD_REQUEST,
                "Validation Error",
                "error", finalMessage
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }
}
