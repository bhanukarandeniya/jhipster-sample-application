package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Visit;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Visit}.
 */
public interface VisitService {
    /**
     * Save a visit.
     *
     * @param visit the entity to save.
     * @return the persisted entity.
     */
    Visit save(Visit visit);

    /**
     * Partially updates a visit.
     *
     * @param visit the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Visit> partialUpdate(Visit visit);

    /**
     * Get all the visits.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Visit> findAll(Pageable pageable);

    /**
     * Get the "id" visit.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Visit> findOne(Long id);

    /**
     * Delete the "id" visit.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
