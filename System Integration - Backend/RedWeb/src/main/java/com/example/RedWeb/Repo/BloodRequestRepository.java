package com.example.RedWeb.Repo;

import com.example.RedWeb.Entity.BloodRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BloodRequestRepository extends JpaRepository <BloodRequestEntity, Long> {
    List<BloodRequestEntity> findByCreatedByEmail(String email);

    @Query("SELECT b FROM BloodRequestEntity b ORDER BY b.createdAt DESC")
    List<BloodRequestEntity> findAllSortedByDateDesc();
}
