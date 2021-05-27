package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Billing;
import com.mycompany.myapp.repository.BillingRepository;
import com.mycompany.myapp.service.BillingService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Billing}.
 */
@RestController
@RequestMapping("/api")
public class BillingResource {

    private final Logger log = LoggerFactory.getLogger(BillingResource.class);

    private static final String ENTITY_NAME = "billing";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BillingService billingService;

    private final BillingRepository billingRepository;

    public BillingResource(BillingService billingService, BillingRepository billingRepository) {
        this.billingService = billingService;
        this.billingRepository = billingRepository;
    }

    /**
     * {@code POST  /billings} : Create a new billing.
     *
     * @param billing the billing to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new billing, or with status {@code 400 (Bad Request)} if the billing has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/billings")
    public ResponseEntity<Billing> createBilling(@Valid @RequestBody Billing billing) throws URISyntaxException {
        log.debug("REST request to save Billing : {}", billing);
        if (billing.getId() != null) {
            throw new BadRequestAlertException("A new billing cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Billing result = billingService.save(billing);
        return ResponseEntity
            .created(new URI("/api/billings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /billings/:id} : Updates an existing billing.
     *
     * @param id the id of the billing to save.
     * @param billing the billing to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated billing,
     * or with status {@code 400 (Bad Request)} if the billing is not valid,
     * or with status {@code 500 (Internal Server Error)} if the billing couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/billings/{id}")
    public ResponseEntity<Billing> updateBilling(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Billing billing
    ) throws URISyntaxException {
        log.debug("REST request to update Billing : {}, {}", id, billing);
        if (billing.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, billing.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!billingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Billing result = billingService.save(billing);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, billing.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /billings/:id} : Partial updates given fields of an existing billing, field will ignore if it is null
     *
     * @param id the id of the billing to save.
     * @param billing the billing to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated billing,
     * or with status {@code 400 (Bad Request)} if the billing is not valid,
     * or with status {@code 404 (Not Found)} if the billing is not found,
     * or with status {@code 500 (Internal Server Error)} if the billing couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/billings/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Billing> partialUpdateBilling(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Billing billing
    ) throws URISyntaxException {
        log.debug("REST request to partial update Billing partially : {}, {}", id, billing);
        if (billing.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, billing.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!billingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Billing> result = billingService.partialUpdate(billing);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, billing.getId().toString())
        );
    }

    /**
     * {@code GET  /billings} : get all the billings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of billings in body.
     */
    @GetMapping("/billings")
    public List<Billing> getAllBillings() {
        log.debug("REST request to get all Billings");
        return billingService.findAll();
    }

    /**
     * {@code GET  /billings/:id} : get the "id" billing.
     *
     * @param id the id of the billing to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the billing, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/billings/{id}")
    public ResponseEntity<Billing> getBilling(@PathVariable Long id) {
        log.debug("REST request to get Billing : {}", id);
        Optional<Billing> billing = billingService.findOne(id);
        return ResponseUtil.wrapOrNotFound(billing);
    }

    /**
     * {@code DELETE  /billings/:id} : delete the "id" billing.
     *
     * @param id the id of the billing to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/billings/{id}")
    public ResponseEntity<Void> deleteBilling(@PathVariable Long id) {
        log.debug("REST request to delete Billing : {}", id);
        billingService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
