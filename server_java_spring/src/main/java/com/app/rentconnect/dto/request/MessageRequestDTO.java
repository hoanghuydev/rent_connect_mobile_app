package com.app.rentconnect.dto.request;

import com.app.rentconnect.entity.Conversation;
import com.app.rentconnect.entity.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)

public class MessageRequestDTO {
    Long messageId;
    Conversation conversation;
    User sender;
    String messageText;
    LocalDateTime sentAt = LocalDateTime.now();
    LocalDateTime deletedAt;
}
