package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Holiday;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Holiday}.
 */
public interface HolidayService {
    /**
     * Save a holiday.
     *
     * @param holiday the entity to save.
     * @return the persisted entity.
     */
    Holiday save(Holiday holiday);

    /**
     * Partially updates a holiday.
     *
     * @param holiday the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Holiday> partialUpdate(Holiday holiday);

    /**
     * Get all the holidays.
     *
     * @return the list of entities.
     */
    List<Holiday> findAll();

    /**
     * Get the "id" holiday.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Holiday> findOne(Long id);

    /**
     * Delete the "id" holiday.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
