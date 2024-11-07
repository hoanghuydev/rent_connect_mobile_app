package com.app.rentconnect.dto.request;
import com.app.rentconnect.entity.Message;
import com.app.rentconnect.entity.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)

public class ConversationRequestDTO {
    private List<MessageRequestDTO> messages;
    Long conversationId;
    UserRequestDTO owner;
    UserRequestDTO customer;
    LocalDateTime createdAt = LocalDateTime.now();
    LocalDateTime deletedAt;
}
