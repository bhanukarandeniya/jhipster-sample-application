package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Physician;
import com.mycompany.myapp.repository.PhysicianRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PhysicianResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PhysicianResourceIT {

    private static final String DEFAULT_PHYSICIAN_ID = "AAAAAAAAAA";
    private static final String UPDATED_PHYSICIAN_ID = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CREATED = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_MODIFIED = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_MODIFIED = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_CREATED_BY = 1;
    private static final Integer UPDATED_CREATED_BY = 2;

    private static final Integer DEFAULT_MODIFIED_BY = 1;
    private static final Integer UPDATED_MODIFIED_BY = 2;

    private static final String ENTITY_API_URL = "/api/physicians";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PhysicianRepository physicianRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPhysicianMockMvc;

    private Physician physician;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Physician createEntity(EntityManager em) {
        Physician physician = new Physician()
            .physicianId(DEFAULT_PHYSICIAN_ID)
            .name(DEFAULT_NAME)
            .created(DEFAULT_CREATED)
            .modified(DEFAULT_MODIFIED)
            .createdBy(DEFAULT_CREATED_BY)
            .modifiedBy(DEFAULT_MODIFIED_BY);
        return physician;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Physician createUpdatedEntity(EntityManager em) {
        Physician physician = new Physician()
            .physicianId(UPDATED_PHYSICIAN_ID)
            .name(UPDATED_NAME)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED)
            .createdBy(UPDATED_CREATED_BY)
            .modifiedBy(UPDATED_MODIFIED_BY);
        return physician;
    }

    @BeforeEach
    public void initTest() {
        physician = createEntity(em);
    }

    @Test
    @Transactional
    void createPhysician() throws Exception {
        int databaseSizeBeforeCreate = physicianRepository.findAll().size();
        // Create the Physician
        restPhysicianMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(physician)))
            .andExpect(status().isCreated());

        // Validate the Physician in the database
        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeCreate + 1);
        Physician testPhysician = physicianList.get(physicianList.size() - 1);
        assertThat(testPhysician.getPhysicianId()).isEqualTo(DEFAULT_PHYSICIAN_ID);
        assertThat(testPhysician.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPhysician.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testPhysician.getModified()).isEqualTo(DEFAULT_MODIFIED);
        assertThat(testPhysician.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
        assertThat(testPhysician.getModifiedBy()).isEqualTo(DEFAULT_MODIFIED_BY);
    }

    @Test
    @Transactional
    void createPhysicianWithExistingId() throws Exception {
        // Create the Physician with an existing ID
        physician.setId(1L);

        int databaseSizeBeforeCreate = physicianRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPhysicianMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(physician)))
            .andExpect(status().isBadRequest());

        // Validate the Physician in the database
        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPhysicianIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = physicianRepository.findAll().size();
        // set the field null
        physician.setPhysicianId(null);

        // Create the Physician, which fails.

        restPhysicianMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(physician)))
            .andExpect(status().isBadRequest());

        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = physicianRepository.findAll().size();
        // set the field null
        physician.setName(null);

        // Create the Physician, which fails.

        restPhysicianMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(physician)))
            .andExpect(status().isBadRequest());

        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCreatedIsRequired() throws Exception {
        int databaseSizeBeforeTest = physicianRepository.findAll().size();
        // set the field null
        physician.setCreated(null);

        // Create the Physician, which fails.

        restPhysicianMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(physician)))
            .andExpect(status().isBadRequest());

        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCreatedByIsRequired() throws Exception {
        int databaseSizeBeforeTest = physicianRepository.findAll().size();
        // set the field null
        physician.setCreatedBy(null);

        // Create the Physician, which fails.

        restPhysicianMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(physician)))
            .andExpect(status().isBadRequest());

        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkModifiedByIsRequired() throws Exception {
        int databaseSizeBeforeTest = physicianRepository.findAll().size();
        // set the field null
        physician.setModifiedBy(null);

        // Create the Physician, which fails.

        restPhysicianMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(physician)))
            .andExpect(status().isBadRequest());

        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPhysicians() throws Exception {
        // Initialize the database
        physicianRepository.saveAndFlush(physician);

        // Get all the physicianList
        restPhysicianMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(physician.getId().intValue())))
            .andExpect(jsonPath("$.[*].physicianId").value(hasItem(DEFAULT_PHYSICIAN_ID)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].created").value(hasItem(DEFAULT_CREATED.toString())))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(DEFAULT_MODIFIED.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].modifiedBy").value(hasItem(DEFAULT_MODIFIED_BY)));
    }

    @Test
    @Transactional
    void getPhysician() throws Exception {
        // Initialize the database
        physicianRepository.saveAndFlush(physician);

        // Get the physician
        restPhysicianMockMvc
            .perform(get(ENTITY_API_URL_ID, physician.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(physician.getId().intValue()))
            .andExpect(jsonPath("$.physicianId").value(DEFAULT_PHYSICIAN_ID))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.created").value(DEFAULT_CREATED.toString()))
            .andExpect(jsonPath("$.modified").value(DEFAULT_MODIFIED.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.modifiedBy").value(DEFAULT_MODIFIED_BY));
    }

    @Test
    @Transactional
    void getNonExistingPhysician() throws Exception {
        // Get the physician
        restPhysicianMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPhysician() throws Exception {
        // Initialize the database
        physicianRepository.saveAndFlush(physician);

        int databaseSizeBeforeUpdate = physicianRepository.findAll().size();

        // Update the physician
        Physician updatedPhysician = physicianRepository.findById(physician.getId()).get();
        // Disconnect from session so that the updates on updatedPhysician are not directly saved in db
        em.detach(updatedPhysician);
        updatedPhysician
            .physicianId(UPDATED_PHYSICIAN_ID)
            .name(UPDATED_NAME)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED)
            .createdBy(UPDATED_CREATED_BY)
            .modifiedBy(UPDATED_MODIFIED_BY);

        restPhysicianMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPhysician.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPhysician))
            )
            .andExpect(status().isOk());

        // Validate the Physician in the database
        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeUpdate);
        Physician testPhysician = physicianList.get(physicianList.size() - 1);
        assertThat(testPhysician.getPhysicianId()).isEqualTo(UPDATED_PHYSICIAN_ID);
        assertThat(testPhysician.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPhysician.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testPhysician.getModified()).isEqualTo(UPDATED_MODIFIED);
        assertThat(testPhysician.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testPhysician.getModifiedBy()).isEqualTo(UPDATED_MODIFIED_BY);
    }

    @Test
    @Transactional
    void putNonExistingPhysician() throws Exception {
        int databaseSizeBeforeUpdate = physicianRepository.findAll().size();
        physician.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPhysicianMockMvc
            .perform(
                put(ENTITY_API_URL_ID, physician.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(physician))
            )
            .andExpect(status().isBadRequest());

        // Validate the Physician in the database
        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPhysician() throws Exception {
        int databaseSizeBeforeUpdate = physicianRepository.findAll().size();
        physician.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhysicianMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(physician))
            )
            .andExpect(status().isBadRequest());

        // Validate the Physician in the database
        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPhysician() throws Exception {
        int databaseSizeBeforeUpdate = physicianRepository.findAll().size();
        physician.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhysicianMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(physician)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Physician in the database
        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePhysicianWithPatch() throws Exception {
        // Initialize the database
        physicianRepository.saveAndFlush(physician);

        int databaseSizeBeforeUpdate = physicianRepository.findAll().size();

        // Update the physician using partial update
        Physician partialUpdatedPhysician = new Physician();
        partialUpdatedPhysician.setId(physician.getId());

        partialUpdatedPhysician.physicianId(UPDATED_PHYSICIAN_ID).createdBy(UPDATED_CREATED_BY).modifiedBy(UPDATED_MODIFIED_BY);

        restPhysicianMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPhysician.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPhysician))
            )
            .andExpect(status().isOk());

        // Validate the Physician in the database
        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeUpdate);
        Physician testPhysician = physicianList.get(physicianList.size() - 1);
        assertThat(testPhysician.getPhysicianId()).isEqualTo(UPDATED_PHYSICIAN_ID);
        assertThat(testPhysician.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPhysician.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testPhysician.getModified()).isEqualTo(DEFAULT_MODIFIED);
        assertThat(testPhysician.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testPhysician.getModifiedBy()).isEqualTo(UPDATED_MODIFIED_BY);
    }

    @Test
    @Transactional
    void fullUpdatePhysicianWithPatch() throws Exception {
        // Initialize the database
        physicianRepository.saveAndFlush(physician);

        int databaseSizeBeforeUpdate = physicianRepository.findAll().size();

        // Update the physician using partial update
        Physician partialUpdatedPhysician = new Physician();
        partialUpdatedPhysician.setId(physician.getId());

        partialUpdatedPhysician
            .physicianId(UPDATED_PHYSICIAN_ID)
            .name(UPDATED_NAME)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED)
            .createdBy(UPDATED_CREATED_BY)
            .modifiedBy(UPDATED_MODIFIED_BY);

        restPhysicianMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPhysician.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPhysician))
            )
            .andExpect(status().isOk());

        // Validate the Physician in the database
        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeUpdate);
        Physician testPhysician = physicianList.get(physicianList.size() - 1);
        assertThat(testPhysician.getPhysicianId()).isEqualTo(UPDATED_PHYSICIAN_ID);
        assertThat(testPhysician.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPhysician.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testPhysician.getModified()).isEqualTo(UPDATED_MODIFIED);
        assertThat(testPhysician.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testPhysician.getModifiedBy()).isEqualTo(UPDATED_MODIFIED_BY);
    }

    @Test
    @Transactional
    void patchNonExistingPhysician() throws Exception {
        int databaseSizeBeforeUpdate = physicianRepository.findAll().size();
        physician.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPhysicianMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, physician.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(physician))
            )
            .andExpect(status().isBadRequest());

        // Validate the Physician in the database
        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPhysician() throws Exception {
        int databaseSizeBeforeUpdate = physicianRepository.findAll().size();
        physician.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhysicianMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(physician))
            )
            .andExpect(status().isBadRequest());

        // Validate the Physician in the database
        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPhysician() throws Exception {
        int databaseSizeBeforeUpdate = physicianRepository.findAll().size();
        physician.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhysicianMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(physician))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Physician in the database
        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePhysician() throws Exception {
        // Initialize the database
        physicianRepository.saveAndFlush(physician);

        int databaseSizeBeforeDelete = physicianRepository.findAll().size();

        // Delete the physician
        restPhysicianMockMvc
            .perform(delete(ENTITY_API_URL_ID, physician.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Physician> physicianList = physicianRepository.findAll();
        assertThat(physicianList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
