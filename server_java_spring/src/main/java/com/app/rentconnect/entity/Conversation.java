package com.app.rentconnect.entity;
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
@Entity
@Table(name = "conversations")
public class Conversation {

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL)
    private List<Message> messages;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long conversationId;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    User owner;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    User customer;

    @Column(nullable = false)
    @CreatedDate
    LocalDateTime createdAt = LocalDateTime.now();

    LocalDateTime deletedAt;
}