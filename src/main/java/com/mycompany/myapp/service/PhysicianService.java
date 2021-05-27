package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Physician;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Physician}.
 */
public interface PhysicianService {
    /**
     * Save a physician.
     *
     * @param physician the entity to save.
     * @return the persisted entity.
     */
    Physician save(Physician physician);

    /**
     * Partially updates a physician.
     *
     * @param physician the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Physician> partialUpdate(Physician physician);

    /**
     * Get all the physicians.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Physician> findAll(Pageable pageable);

    /**
     * Get the "id" physician.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Physician> findOne(Long id);

    /**
     * Delete the "id" physician.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
