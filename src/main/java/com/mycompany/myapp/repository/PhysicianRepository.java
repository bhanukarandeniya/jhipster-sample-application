package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Physician;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Physician entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PhysicianRepository extends JpaRepository<Physician, Long> {}
