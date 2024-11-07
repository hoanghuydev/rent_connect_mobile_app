package com.app.rentconnect.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long messageId;

    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    Conversation conversation;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    User sender;

    @Column(nullable = false)
    String messageText;

    @Column(nullable = false)
    @CreatedDate
    LocalDateTime sentAt = LocalDateTime.now();

    LocalDateTime deletedAt;
}