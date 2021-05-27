package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Physician;
import com.mycompany.myapp.repository.PhysicianRepository;
import com.mycompany.myapp.service.PhysicianService;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Physician}.
 */
@RestController
@RequestMapping("/api")
public class PhysicianResource {

    private final Logger log = LoggerFactory.getLogger(PhysicianResource.class);

    private static final String ENTITY_NAME = "physician";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PhysicianService physicianService;

    private final PhysicianRepository physicianRepository;

    public PhysicianResource(PhysicianService physicianService, PhysicianRepository physicianRepository) {
        this.physicianService = physicianService;
        this.physicianRepository = physicianRepository;
    }

    /**
     * {@code POST  /physicians} : Create a new physician.
     *
     * @param physician the physician to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new physician, or with status {@code 400 (Bad Request)} if the physician has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/physicians")
    public ResponseEntity<Physician> createPhysician(@Valid @RequestBody Physician physician) throws URISyntaxException {
        log.debug("REST request to save Physician : {}", physician);
        if (physician.getId() != null) {
            throw new BadRequestAlertException("A new physician cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Physician result = physicianService.save(physician);
        return ResponseEntity
            .created(new URI("/api/physicians/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /physicians/:id} : Updates an existing physician.
     *
     * @param id the id of the physician to save.
     * @param physician the physician to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated physician,
     * or with status {@code 400 (Bad Request)} if the physician is not valid,
     * or with status {@code 500 (Internal Server Error)} if the physician couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/physicians/{id}")
    public ResponseEntity<Physician> updatePhysician(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Physician physician
    ) throws URISyntaxException {
        log.debug("REST request to update Physician : {}, {}", id, physician);
        if (physician.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, physician.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!physicianRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Physician result = physicianService.save(physician);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, physician.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /physicians/:id} : Partial updates given fields of an existing physician, field will ignore if it is null
     *
     * @param id the id of the physician to save.
     * @param physician the physician to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated physician,
     * or with status {@code 400 (Bad Request)} if the physician is not valid,
     * or with status {@code 404 (Not Found)} if the physician is not found,
     * or with status {@code 500 (Internal Server Error)} if the physician couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/physicians/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Physician> partialUpdatePhysician(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Physician physician
    ) throws URISyntaxException {
        log.debug("REST request to partial update Physician partially : {}, {}", id, physician);
        if (physician.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, physician.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!physicianRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Physician> result = physicianService.partialUpdate(physician);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, physician.getId().toString())
        );
    }

    /**
     * {@code GET  /physicians} : get all the physicians.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of physicians in body.
     */
    @GetMapping("/physicians")
    public ResponseEntity<List<Physician>> getAllPhysicians(Pageable pageable) {
        log.debug("REST request to get a page of Physicians");
        Page<Physician> page = physicianService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /physicians/:id} : get the "id" physician.
     *
     * @param id the id of the physician to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the physician, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/physicians/{id}")
    public ResponseEntity<Physician> getPhysician(@PathVariable Long id) {
        log.debug("REST request to get Physician : {}", id);
        Optional<Physician> physician = physicianService.findOne(id);
        return ResponseUtil.wrapOrNotFound(physician);
    }

    /**
     * {@code DELETE  /physicians/:id} : delete the "id" physician.
     *
     * @param id the id of the physician to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/physicians/{id}")
    public ResponseEntity<Void> deletePhysician(@PathVariable Long id) {
        log.debug("REST request to delete Physician : {}", id);
        physicianService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
