package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Holiday;
import com.mycompany.myapp.repository.HolidayRepository;
import com.mycompany.myapp.service.HolidayService;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Holiday}.
 */
@RestController
@RequestMapping("/api")
public class HolidayResource {

    private final Logger log = LoggerFactory.getLogger(HolidayResource.class);

    private static final String ENTITY_NAME = "holiday";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HolidayService holidayService;

    private final HolidayRepository holidayRepository;

    public HolidayResource(HolidayService holidayService, HolidayRepository holidayRepository) {
        this.holidayService = holidayService;
        this.holidayRepository = holidayRepository;
    }

    /**
     * {@code POST  /holidays} : Create a new holiday.
     *
     * @param holiday the holiday to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new holiday, or with status {@code 400 (Bad Request)} if the holiday has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/holidays")
    public ResponseEntity<Holiday> createHoliday(@Valid @RequestBody Holiday holiday) throws URISyntaxException {
        log.debug("REST request to save Holiday : {}", holiday);
        if (holiday.getId() != null) {
            throw new BadRequestAlertException("A new holiday cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Holiday result = holidayService.save(holiday);
        return ResponseEntity
            .created(new URI("/api/holidays/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /holidays/:id} : Updates an existing holiday.
     *
     * @param id the id of the holiday to save.
     * @param holiday the holiday to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated holiday,
     * or with status {@code 400 (Bad Request)} if the holiday is not valid,
     * or with status {@code 500 (Internal Server Error)} if the holiday couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/holidays/{id}")
    public ResponseEntity<Holiday> updateHoliday(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Holiday holiday
    ) throws URISyntaxException {
        log.debug("REST request to update Holiday : {}, {}", id, holiday);
        if (holiday.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, holiday.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!holidayRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Holiday result = holidayService.save(holiday);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, holiday.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /holidays/:id} : Partial updates given fields of an existing holiday, field will ignore if it is null
     *
     * @param id the id of the holiday to save.
     * @param holiday the holiday to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated holiday,
     * or with status {@code 400 (Bad Request)} if the holiday is not valid,
     * or with status {@code 404 (Not Found)} if the holiday is not found,
     * or with status {@code 500 (Internal Server Error)} if the holiday couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/holidays/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Holiday> partialUpdateHoliday(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Holiday holiday
    ) throws URISyntaxException {
        log.debug("REST request to partial update Holiday partially : {}, {}", id, holiday);
        if (holiday.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, holiday.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!holidayRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Holiday> result = holidayService.partialUpdate(holiday);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, holiday.getId().toString())
        );
    }

    /**
     * {@code GET  /holidays} : get all the holidays.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of holidays in body.
     */
    @GetMapping("/holidays")
    public List<Holiday> getAllHolidays() {
        log.debug("REST request to get all Holidays");
        return holidayService.findAll();
    }

    /**
     * {@code GET  /holidays/:id} : get the "id" holiday.
     *
     * @param id the id of the holiday to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the holiday, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/holidays/{id}")
    public ResponseEntity<Holiday> getHoliday(@PathVariable Long id) {
        log.debug("REST request to get Holiday : {}", id);
        Optional<Holiday> holiday = holidayService.findOne(id);
        return ResponseUtil.wrapOrNotFound(holiday);
    }

    /**
     * {@code DELETE  /holidays/:id} : delete the "id" holiday.
     *
     * @param id the id of the holiday to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/holidays/{id}")
    public ResponseEntity<Void> deleteHoliday(@PathVariable Long id) {
        log.debug("REST request to delete Holiday : {}", id);
        holidayService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
