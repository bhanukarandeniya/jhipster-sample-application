package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Billing;
import com.mycompany.myapp.repository.BillingRepository;
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
 * Integration tests for the {@link BillingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BillingResourceIT {

    private static final Integer DEFAULT_VISIT_ID = 1;
    private static final Integer UPDATED_VISIT_ID = 2;

    private static final String DEFAULT_PATIENT_ID = "AAAAAAAAAA";
    private static final String UPDATED_PATIENT_ID = "BBBBBBBBBB";

    private static final String DEFAULT_PHYSICIAN_ID = "AAAAAAAAAA";
    private static final String UPDATED_PHYSICIAN_ID = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_BILLED = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_BILLED = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/billings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BillingRepository billingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBillingMockMvc;

    private Billing billing;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Billing createEntity(EntityManager em) {
        Billing billing = new Billing()
            .visitId(DEFAULT_VISIT_ID)
            .patientId(DEFAULT_PATIENT_ID)
            .physicianId(DEFAULT_PHYSICIAN_ID)
            .billed(DEFAULT_BILLED);
        return billing;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Billing createUpdatedEntity(EntityManager em) {
        Billing billing = new Billing()
            .visitId(UPDATED_VISIT_ID)
            .patientId(UPDATED_PATIENT_ID)
            .physicianId(UPDATED_PHYSICIAN_ID)
            .billed(UPDATED_BILLED);
        return billing;
    }

    @BeforeEach
    public void initTest() {
        billing = createEntity(em);
    }

    @Test
    @Transactional
    void createBilling() throws Exception {
        int databaseSizeBeforeCreate = billingRepository.findAll().size();
        // Create the Billing
        restBillingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(billing)))
            .andExpect(status().isCreated());

        // Validate the Billing in the database
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeCreate + 1);
        Billing testBilling = billingList.get(billingList.size() - 1);
        assertThat(testBilling.getVisitId()).isEqualTo(DEFAULT_VISIT_ID);
        assertThat(testBilling.getPatientId()).isEqualTo(DEFAULT_PATIENT_ID);
        assertThat(testBilling.getPhysicianId()).isEqualTo(DEFAULT_PHYSICIAN_ID);
        assertThat(testBilling.getBilled()).isEqualTo(DEFAULT_BILLED);
    }

    @Test
    @Transactional
    void createBillingWithExistingId() throws Exception {
        // Create the Billing with an existing ID
        billing.setId(1L);

        int databaseSizeBeforeCreate = billingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBillingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(billing)))
            .andExpect(status().isBadRequest());

        // Validate the Billing in the database
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkVisitIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = billingRepository.findAll().size();
        // set the field null
        billing.setVisitId(null);

        // Create the Billing, which fails.

        restBillingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(billing)))
            .andExpect(status().isBadRequest());

        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPhysicianIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = billingRepository.findAll().size();
        // set the field null
        billing.setPhysicianId(null);

        // Create the Billing, which fails.

        restBillingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(billing)))
            .andExpect(status().isBadRequest());

        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkBilledIsRequired() throws Exception {
        int databaseSizeBeforeTest = billingRepository.findAll().size();
        // set the field null
        billing.setBilled(null);

        // Create the Billing, which fails.

        restBillingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(billing)))
            .andExpect(status().isBadRequest());

        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBillings() throws Exception {
        // Initialize the database
        billingRepository.saveAndFlush(billing);

        // Get all the billingList
        restBillingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(billing.getId().intValue())))
            .andExpect(jsonPath("$.[*].visitId").value(hasItem(DEFAULT_VISIT_ID)))
            .andExpect(jsonPath("$.[*].patientId").value(hasItem(DEFAULT_PATIENT_ID)))
            .andExpect(jsonPath("$.[*].physicianId").value(hasItem(DEFAULT_PHYSICIAN_ID)))
            .andExpect(jsonPath("$.[*].billed").value(hasItem(DEFAULT_BILLED.toString())));
    }

    @Test
    @Transactional
    void getBilling() throws Exception {
        // Initialize the database
        billingRepository.saveAndFlush(billing);

        // Get the billing
        restBillingMockMvc
            .perform(get(ENTITY_API_URL_ID, billing.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(billing.getId().intValue()))
            .andExpect(jsonPath("$.visitId").value(DEFAULT_VISIT_ID))
            .andExpect(jsonPath("$.patientId").value(DEFAULT_PATIENT_ID))
            .andExpect(jsonPath("$.physicianId").value(DEFAULT_PHYSICIAN_ID))
            .andExpect(jsonPath("$.billed").value(DEFAULT_BILLED.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBilling() throws Exception {
        // Get the billing
        restBillingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBilling() throws Exception {
        // Initialize the database
        billingRepository.saveAndFlush(billing);

        int databaseSizeBeforeUpdate = billingRepository.findAll().size();

        // Update the billing
        Billing updatedBilling = billingRepository.findById(billing.getId()).get();
        // Disconnect from session so that the updates on updatedBilling are not directly saved in db
        em.detach(updatedBilling);
        updatedBilling.visitId(UPDATED_VISIT_ID).patientId(UPDATED_PATIENT_ID).physicianId(UPDATED_PHYSICIAN_ID).billed(UPDATED_BILLED);

        restBillingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBilling.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBilling))
            )
            .andExpect(status().isOk());

        // Validate the Billing in the database
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeUpdate);
        Billing testBilling = billingList.get(billingList.size() - 1);
        assertThat(testBilling.getVisitId()).isEqualTo(UPDATED_VISIT_ID);
        assertThat(testBilling.getPatientId()).isEqualTo(UPDATED_PATIENT_ID);
        assertThat(testBilling.getPhysicianId()).isEqualTo(UPDATED_PHYSICIAN_ID);
        assertThat(testBilling.getBilled()).isEqualTo(UPDATED_BILLED);
    }

    @Test
    @Transactional
    void putNonExistingBilling() throws Exception {
        int databaseSizeBeforeUpdate = billingRepository.findAll().size();
        billing.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBillingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, billing.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(billing))
            )
            .andExpect(status().isBadRequest());

        // Validate the Billing in the database
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBilling() throws Exception {
        int databaseSizeBeforeUpdate = billingRepository.findAll().size();
        billing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBillingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(billing))
            )
            .andExpect(status().isBadRequest());

        // Validate the Billing in the database
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBilling() throws Exception {
        int databaseSizeBeforeUpdate = billingRepository.findAll().size();
        billing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBillingMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(billing)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Billing in the database
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBillingWithPatch() throws Exception {
        // Initialize the database
        billingRepository.saveAndFlush(billing);

        int databaseSizeBeforeUpdate = billingRepository.findAll().size();

        // Update the billing using partial update
        Billing partialUpdatedBilling = new Billing();
        partialUpdatedBilling.setId(billing.getId());

        partialUpdatedBilling.patientId(UPDATED_PATIENT_ID).billed(UPDATED_BILLED);

        restBillingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBilling.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBilling))
            )
            .andExpect(status().isOk());

        // Validate the Billing in the database
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeUpdate);
        Billing testBilling = billingList.get(billingList.size() - 1);
        assertThat(testBilling.getVisitId()).isEqualTo(DEFAULT_VISIT_ID);
        assertThat(testBilling.getPatientId()).isEqualTo(UPDATED_PATIENT_ID);
        assertThat(testBilling.getPhysicianId()).isEqualTo(DEFAULT_PHYSICIAN_ID);
        assertThat(testBilling.getBilled()).isEqualTo(UPDATED_BILLED);
    }

    @Test
    @Transactional
    void fullUpdateBillingWithPatch() throws Exception {
        // Initialize the database
        billingRepository.saveAndFlush(billing);

        int databaseSizeBeforeUpdate = billingRepository.findAll().size();

        // Update the billing using partial update
        Billing partialUpdatedBilling = new Billing();
        partialUpdatedBilling.setId(billing.getId());

        partialUpdatedBilling
            .visitId(UPDATED_VISIT_ID)
            .patientId(UPDATED_PATIENT_ID)
            .physicianId(UPDATED_PHYSICIAN_ID)
            .billed(UPDATED_BILLED);

        restBillingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBilling.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBilling))
            )
            .andExpect(status().isOk());

        // Validate the Billing in the database
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeUpdate);
        Billing testBilling = billingList.get(billingList.size() - 1);
        assertThat(testBilling.getVisitId()).isEqualTo(UPDATED_VISIT_ID);
        assertThat(testBilling.getPatientId()).isEqualTo(UPDATED_PATIENT_ID);
        assertThat(testBilling.getPhysicianId()).isEqualTo(UPDATED_PHYSICIAN_ID);
        assertThat(testBilling.getBilled()).isEqualTo(UPDATED_BILLED);
    }

    @Test
    @Transactional
    void patchNonExistingBilling() throws Exception {
        int databaseSizeBeforeUpdate = billingRepository.findAll().size();
        billing.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBillingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, billing.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(billing))
            )
            .andExpect(status().isBadRequest());

        // Validate the Billing in the database
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBilling() throws Exception {
        int databaseSizeBeforeUpdate = billingRepository.findAll().size();
        billing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBillingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(billing))
            )
            .andExpect(status().isBadRequest());

        // Validate the Billing in the database
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBilling() throws Exception {
        int databaseSizeBeforeUpdate = billingRepository.findAll().size();
        billing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBillingMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(billing)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Billing in the database
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBilling() throws Exception {
        // Initialize the database
        billingRepository.saveAndFlush(billing);

        int databaseSizeBeforeDelete = billingRepository.findAll().size();

        // Delete the billing
        restBillingMockMvc
            .perform(delete(ENTITY_API_URL_ID, billing.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
