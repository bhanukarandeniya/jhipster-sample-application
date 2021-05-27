package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Billing;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Billing}.
 */
public interface BillingService {
    /**
     * Save a billing.
     *
     * @param billing the entity to save.
     * @return the persisted entity.
     */
    Billing save(Billing billing);

    /**
     * Partially updates a billing.
     *
     * @param billing the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Billing> partialUpdate(Billing billing);

    /**
     * Get all the billings.
     *
     * @return the list of entities.
     */
    List<Billing> findAll();

    /**
     * Get the "id" billing.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Billing> findOne(Long id);

    /**
     * Delete the "id" billing.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
