package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Holiday;
import com.mycompany.myapp.repository.HolidayRepository;
import com.mycompany.myapp.service.HolidayService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Holiday}.
 */
@Service
@Transactional
public class HolidayServiceImpl implements HolidayService {

    private final Logger log = LoggerFactory.getLogger(HolidayServiceImpl.class);

    private final HolidayRepository holidayRepository;

    public HolidayServiceImpl(HolidayRepository holidayRepository) {
        this.holidayRepository = holidayRepository;
    }

    @Override
    public Holiday save(Holiday holiday) {
        log.debug("Request to save Holiday : {}", holiday);
        return holidayRepository.save(holiday);
    }

    @Override
    public Optional<Holiday> partialUpdate(Holiday holiday) {
        log.debug("Request to partially update Holiday : {}", holiday);

        return holidayRepository
            .findById(holiday.getId())
            .map(
                existingHoliday -> {
                    if (holiday.getVisitDateTime() != null) {
                        existingHoliday.setVisitDateTime(holiday.getVisitDateTime());
                    }
                    if (holiday.getReason() != null) {
                        existingHoliday.setReason(holiday.getReason());
                    }
                    if (holiday.getCreated() != null) {
                        existingHoliday.setCreated(holiday.getCreated());
                    }
                    if (holiday.getModified() != null) {
                        existingHoliday.setModified(holiday.getModified());
                    }
                    if (holiday.getCreatedBy() != null) {
                        existingHoliday.setCreatedBy(holiday.getCreatedBy());
                    }
                    if (holiday.getModifiedBy() != null) {
                        existingHoliday.setModifiedBy(holiday.getModifiedBy());
                    }

                    return existingHoliday;
                }
            )
            .map(holidayRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Holiday> findAll() {
        log.debug("Request to get all Holidays");
        return holidayRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Holiday> findOne(Long id) {
        log.debug("Request to get Holiday : {}", id);
        return holidayRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Holiday : {}", id);
        holidayRepository.deleteById(id);
    }
}
