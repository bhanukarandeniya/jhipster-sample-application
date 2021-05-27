package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Billing;
import com.mycompany.myapp.repository.BillingRepository;
import com.mycompany.myapp.service.BillingService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Billing}.
 */
@Service
@Transactional
public class BillingServiceImpl implements BillingService {

    private final Logger log = LoggerFactory.getLogger(BillingServiceImpl.class);

    private final BillingRepository billingRepository;

    public BillingServiceImpl(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    @Override
    public Billing save(Billing billing) {
        log.debug("Request to save Billing : {}", billing);
        return billingRepository.save(billing);
    }

    @Override
    public Optional<Billing> partialUpdate(Billing billing) {
        log.debug("Request to partially update Billing : {}", billing);

        return billingRepository
            .findById(billing.getId())
            .map(
                existingBilling -> {
                    if (billing.getVisitId() != null) {
                        existingBilling.setVisitId(billing.getVisitId());
                    }
                    if (billing.getPatientId() != null) {
                        existingBilling.setPatientId(billing.getPatientId());
                    }
                    if (billing.getPhysicianId() != null) {
                        existingBilling.setPhysicianId(billing.getPhysicianId());
                    }
                    if (billing.getBilled() != null) {
                        existingBilling.setBilled(billing.getBilled());
                    }

                    return existingBilling;
                }
            )
            .map(billingRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Billing> findAll() {
        log.debug("Request to get all Billings");
        return billingRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Billing> findOne(Long id) {
        log.debug("Request to get Billing : {}", id);
        return billingRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Billing : {}", id);
        billingRepository.deleteById(id);
    }
}
