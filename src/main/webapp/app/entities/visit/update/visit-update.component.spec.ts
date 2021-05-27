jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VisitService } from '../service/visit.service';
import { IVisit, Visit } from '../visit.model';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IPhysician } from 'app/entities/physician/physician.model';
import { PhysicianService } from 'app/entities/physician/service/physician.service';

import { VisitUpdateComponent } from './visit-update.component';

describe('Component Tests', () => {
  describe('Visit Management Update Component', () => {
    let comp: VisitUpdateComponent;
    let fixture: ComponentFixture<VisitUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let visitService: VisitService;
    let patientService: PatientService;
    let physicianService: PhysicianService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VisitUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(VisitUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VisitUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      visitService = TestBed.inject(VisitService);
      patientService = TestBed.inject(PatientService);
      physicianService = TestBed.inject(PhysicianService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Patient query and add missing value', () => {
        const visit: IVisit = { id: 456 };
        const patientId: IPatient = { id: 68611 };
        visit.patientId = patientId;

        const patientCollection: IPatient[] = [{ id: 99540 }];
        spyOn(patientService, 'query').and.returnValue(of(new HttpResponse({ body: patientCollection })));
        const additionalPatients = [patientId];
        const expectedCollection: IPatient[] = [...additionalPatients, ...patientCollection];
        spyOn(patientService, 'addPatientToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ visit });
        comp.ngOnInit();

        expect(patientService.query).toHaveBeenCalled();
        expect(patientService.addPatientToCollectionIfMissing).toHaveBeenCalledWith(patientCollection, ...additionalPatients);
        expect(comp.patientsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Physician query and add missing value', () => {
        const visit: IVisit = { id: 456 };
        const physicianId: IPhysician = { id: 67633 };
        visit.physicianId = physicianId;

        const physicianCollection: IPhysician[] = [{ id: 38496 }];
        spyOn(physicianService, 'query').and.returnValue(of(new HttpResponse({ body: physicianCollection })));
        const additionalPhysicians = [physicianId];
        const expectedCollection: IPhysician[] = [...additionalPhysicians, ...physicianCollection];
        spyOn(physicianService, 'addPhysicianToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ visit });
        comp.ngOnInit();

        expect(physicianService.query).toHaveBeenCalled();
        expect(physicianService.addPhysicianToCollectionIfMissing).toHaveBeenCalledWith(physicianCollection, ...additionalPhysicians);
        expect(comp.physiciansSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const visit: IVisit = { id: 456 };
        const patientId: IPatient = { id: 47629 };
        visit.patientId = patientId;
        const physicianId: IPhysician = { id: 20524 };
        visit.physicianId = physicianId;

        activatedRoute.data = of({ visit });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(visit));
        expect(comp.patientsSharedCollection).toContain(patientId);
        expect(comp.physiciansSharedCollection).toContain(physicianId);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const visit = { id: 123 };
        spyOn(visitService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ visit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: visit }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(visitService.update).toHaveBeenCalledWith(visit);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const visit = new Visit();
        spyOn(visitService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ visit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: visit }));
        saveSubject.complete();

        // THEN
        expect(visitService.create).toHaveBeenCalledWith(visit);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const visit = { id: 123 };
        spyOn(visitService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ visit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(visitService.update).toHaveBeenCalledWith(visit);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPatientById', () => {
        it('Should return tracked Patient primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPatientById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackPhysicianById', () => {
        it('Should return tracked Physician primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPhysicianById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
