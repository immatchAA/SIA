package com.example.RedWeb.Service;

import com.example.RedWeb.DTO.BloodRequestDTO;
import com.example.RedWeb.Entity.BloodRequestEntity;
import com.example.RedWeb.Repo.BloodRequestRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BloodRequestService {
    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @Autowired
    private NotificationService notificationService;

    public List<BloodRequestDTO> getRequestsByEmail(String email) {
        List<BloodRequestEntity> entities = bloodRequestRepository.findByCreatedByEmail(email);
        return entities.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private BloodRequestDTO convertToDto(BloodRequestEntity entity) {
        BloodRequestDTO dto = new BloodRequestDTO();
        dto.setBloodType(entity.getBloodType());
        dto.setUrgencyLevel(entity.getUrgencyLevel());
        dto.setLocation(entity.getLocation());
        dto.setNeededByDate(entity.getNeededByDate());
        dto.setNeededByTime(entity.getNeededByTime());
        dto.setReason(entity.getReason());
        dto.setAdditionalNotes(entity.getAdditionalNotes());
        dto.setContactByEmail(entity.isContactByEmail());
        dto.setContactByPhone(entity.isContactByPhone());
        dto.setContactInApp(entity.isContactInApp());
        dto.setShareContact(entity.isShareContact());
        dto.setCreatedByEmail(entity.getCreatedByEmail());
        return dto;
    }

    public List<BloodRequestDTO> getAllRequestsSortedByDateDesc() {
        List<BloodRequestEntity> entities = bloodRequestRepository.findAllSortedByDateDesc();
        return entities.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public void saveRequest(BloodRequestDTO dto) {
        BloodRequestEntity entity = new BloodRequestEntity();
        entity.setBloodType(dto.getBloodType());
        entity.setUnitsNeeded(dto.getUnitsNeeded());
        entity.setUrgencyLevel(dto.getUrgencyLevel());
        entity.setLocation(dto.getLocation());
        entity.setNeededByDate(dto.getNeededByDate());
        entity.setNeededByTime(dto.getNeededByTime());
        entity.setReason(dto.getReason());
        entity.setAdditionalNotes(dto.getAdditionalNotes());
        entity.setContactByEmail(dto.isContactByEmail());
        entity.setContactByPhone(dto.isContactByPhone());
        entity.setContactInApp(dto.isContactInApp());
        entity.setShareContact(dto.isShareContact());
        entity.setCreatedByEmail(dto.getCreatedByEmail());

        bloodRequestRepository.save(entity);

        notificationService.save(
                "New Blood Request: " + dto.getBloodType(),
                dto.getReason() + " at " + dto.getLocation()
        );
    }



}
