package com.example.RedWeb.Repo;

import com.example.RedWeb.Entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {
    List<MessageEntity> findBySenderEmailOrReceiverEmail(String senderEmail, String receiverEmail);
}
