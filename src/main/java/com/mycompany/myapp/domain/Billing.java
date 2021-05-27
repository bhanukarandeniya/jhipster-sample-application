package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Billing.
 */
@Entity
@Table(name = "billing")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Billing implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "visit_id", nullable = false)
    private Integer visitId;

    @Column(name = "patient_id")
    private String patientId;

    @NotNull
    @Column(name = "physician_id", nullable = false)
    private String physicianId;

    @NotNull
    @Column(name = "billed", nullable = false)
    private LocalDate billed;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Billing id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getVisitId() {
        return this.visitId;
    }

    public Billing visitId(Integer visitId) {
        this.visitId = visitId;
        return this;
    }

    public void setVisitId(Integer visitId) {
        this.visitId = visitId;
    }

    public String getPatientId() {
        return this.patientId;
    }

    public Billing patientId(String patientId) {
        this.patientId = patientId;
        return this;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getPhysicianId() {
        return this.physicianId;
    }

    public Billing physicianId(String physicianId) {
        this.physicianId = physicianId;
        return this;
    }

    public void setPhysicianId(String physicianId) {
        this.physicianId = physicianId;
    }

    public LocalDate getBilled() {
        return this.billed;
    }

    public Billing billed(LocalDate billed) {
        this.billed = billed;
        return this;
    }

    public void setBilled(LocalDate billed) {
        this.billed = billed;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Billing)) {
            return false;
        }
        return id != null && id.equals(((Billing) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Billing{" +
            "id=" + getId() +
            ", visitId=" + getVisitId() +
            ", patientId='" + getPatientId() + "'" +
            ", physicianId='" + getPhysicianId() + "'" +
            ", billed='" + getBilled() + "'" +
            "}";
    }
}
