package com.app.rentconnect.v1.dto.request;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
