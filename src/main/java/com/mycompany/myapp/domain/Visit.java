package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * not an ignored comment
 */
@ApiModel(description = "not an ignored comment")
@Entity
@Table(name = "visit")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Visit implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "visit_date_time", nullable = false)
    private LocalDate visitDateTime;

    @NotNull
    @Column(name = "reason", nullable = false)
    private String reason;

    @NotNull
    @Column(name = "created", nullable = false)
    private LocalDate created;

    @Column(name = "modified")
    private LocalDate modified;

    @NotNull
    @Column(name = "created_by", nullable = false)
    private Integer createdBy;

    @NotNull
    @Column(name = "modified_by", nullable = false)
    private Integer modifiedBy;

    @ManyToOne
    @JsonIgnoreProperties(value = { "visits" }, allowSetters = true)
    private Patient patientId;

    @ManyToOne
    @JsonIgnoreProperties(value = { "visits" }, allowSetters = true)
    private Physician physicianId;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Visit id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getVisitDateTime() {
        return this.visitDateTime;
    }

    public Visit visitDateTime(LocalDate visitDateTime) {
        this.visitDateTime = visitDateTime;
        return this;
    }

    public void setVisitDateTime(LocalDate visitDateTime) {
        this.visitDateTime = visitDateTime;
    }

    public String getReason() {
        return this.reason;
    }

    public Visit reason(String reason) {
        this.reason = reason;
        return this;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDate getCreated() {
        return this.created;
    }

    public Visit created(LocalDate created) {
        this.created = created;
        return this;
    }

    public void setCreated(LocalDate created) {
        this.created = created;
    }

    public LocalDate getModified() {
        return this.modified;
    }

    public Visit modified(LocalDate modified) {
        this.modified = modified;
        return this;
    }

    public void setModified(LocalDate modified) {
        this.modified = modified;
    }

    public Integer getCreatedBy() {
        return this.createdBy;
    }

    public Visit createdBy(Integer createdBy) {
        this.createdBy = createdBy;
        return this;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }

    public Integer getModifiedBy() {
        return this.modifiedBy;
    }

    public Visit modifiedBy(Integer modifiedBy) {
        this.modifiedBy = modifiedBy;
        return this;
    }

    public void setModifiedBy(Integer modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public Patient getPatientId() {
        return this.patientId;
    }

    public Visit patientId(Patient patient) {
        this.setPatientId(patient);
        return this;
    }

    public void setPatientId(Patient patient) {
        this.patientId = patient;
    }

    public Physician getPhysicianId() {
        return this.physicianId;
    }

    public Visit physicianId(Physician physician) {
        this.setPhysicianId(physician);
        return this;
    }

    public void setPhysicianId(Physician physician) {
        this.physicianId = physician;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Visit)) {
            return false;
        }
        return id != null && id.equals(((Visit) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Visit{" +
            "id=" + getId() +
            ", visitDateTime='" + getVisitDateTime() + "'" +
            ", reason='" + getReason() + "'" +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            ", createdBy=" + getCreatedBy() +
            ", modifiedBy=" + getModifiedBy() +
            "}";
    }
}
