package com.app.rentconnect.v1.dto.request;

import com.app.rentconnect.v1.entity.Conversation;
import com.app.rentconnect.v1.entity.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
