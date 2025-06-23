package com.globetales.repository;

import com.globetales.entity.UserStory;
import com.globetales.dto.UserStoryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserStoryRepository extends JpaRepository<UserStory, UUID> {
    @EntityGraph(attributePaths = "user")
    List<UserStory> findByUserId(UUID userId);

    @Query("SELECT us FROM UserStory us JOIN FETCH us.user WHERE us.user.id = :userId")
    List<UserStory> findByUserIdWithUser(@Param("userId") UUID userId);

    @Query("SELECT new com.globetales.dto.UserStoryDTO(us.id, us.placeId, us.title, us.content, us.createdAt, us.updatedAt, us.user.id) FROM UserStory us WHERE us.user.id = :userId")
    List<UserStoryDTO> findAllDTOByUserId(@Param("userId") UUID userId);
} 