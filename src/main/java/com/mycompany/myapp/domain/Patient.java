package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Patient.
 */
@Entity
@Table(name = "patient")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Patient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "patient_id", nullable = false)
    private String patientId;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "dob", nullable = false)
    private LocalDate dob;

    @NotNull
    @Column(name = "gender", nullable = false)
    private Integer gender;

    @NotNull
    @Column(name = "created", nullable = false)
    private LocalDate created;

    @Column(name = "modified")
    private LocalDate modified;

    @NotNull
    @Column(name = "created_by", nullable = false)
    private Integer createdBy;

    @OneToMany(mappedBy = "patientId")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "patientId", "physicianId" }, allowSetters = true)
    private Set<Visit> visits = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient id(Long id) {
        this.id = id;
        return this;
    }

    public String getPatientId() {
        return this.patientId;
    }

    public Patient patientId(String patientId) {
        this.patientId = patientId;
        return this;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getName() {
        return this.name;
    }

    public Patient name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDob() {
        return this.dob;
    }

    public Patient dob(LocalDate dob) {
        this.dob = dob;
        return this;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public Integer getGender() {
        return this.gender;
    }

    public Patient gender(Integer gender) {
        this.gender = gender;
        return this;
    }

    public void setGender(Integer gender) {
        this.gender = gender;
    }

    public LocalDate getCreated() {
        return this.created;
    }

    public Patient created(LocalDate created) {
        this.created = created;
        return this;
    }

    public void setCreated(LocalDate created) {
        this.created = created;
    }

    public LocalDate getModified() {
        return this.modified;
    }

    public Patient modified(LocalDate modified) {
        this.modified = modified;
        return this;
    }

    public void setModified(LocalDate modified) {
        this.modified = modified;
    }

    public Integer getCreatedBy() {
        return this.createdBy;
    }

    public Patient createdBy(Integer createdBy) {
        this.createdBy = createdBy;
        return this;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }

    public Set<Visit> getVisits() {
        return this.visits;
    }

    public Patient visits(Set<Visit> visits) {
        this.setVisits(visits);
        return this;
    }

    public Patient addVisit(Visit visit) {
        this.visits.add(visit);
        visit.setPatientId(this);
        return this;
    }

    public Patient removeVisit(Visit visit) {
        this.visits.remove(visit);
        visit.setPatientId(null);
        return this;
    }

    public void setVisits(Set<Visit> visits) {
        if (this.visits != null) {
            this.visits.forEach(i -> i.setPatientId(null));
        }
        if (visits != null) {
            visits.forEach(i -> i.setPatientId(this));
        }
        this.visits = visits;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Patient)) {
            return false;
        }
        return id != null && id.equals(((Patient) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Patient{" +
            "id=" + getId() +
            ", patientId='" + getPatientId() + "'" +
            ", name='" + getName() + "'" +
            ", dob='" + getDob() + "'" +
            ", gender=" + getGender() +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            ", createdBy=" + getCreatedBy() +
            "}";
    }
}
