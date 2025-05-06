package com.example.RedWeb.Repo;


import com.example.RedWeb.Entity.DriveEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DriveRepository extends JpaRepository<DriveEntity, Long> {
}
