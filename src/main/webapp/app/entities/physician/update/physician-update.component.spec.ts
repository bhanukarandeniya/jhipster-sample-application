jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PhysicianService } from '../service/physician.service';
import { IPhysician, Physician } from '../physician.model';

import { PhysicianUpdateComponent } from './physician-update.component';

describe('Component Tests', () => {
  describe('Physician Management Update Component', () => {
    let comp: PhysicianUpdateComponent;
    let fixture: ComponentFixture<PhysicianUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let physicianService: PhysicianService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PhysicianUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PhysicianUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PhysicianUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      physicianService = TestBed.inject(PhysicianService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const physician: IPhysician = { id: 456 };

        activatedRoute.data = of({ physician });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(physician));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const physician = { id: 123 };
        spyOn(physicianService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ physician });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: physician }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(physicianService.update).toHaveBeenCalledWith(physician);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const physician = new Physician();
        spyOn(physicianService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ physician });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: physician }));
        saveSubject.complete();

        // THEN
        expect(physicianService.create).toHaveBeenCalledWith(physician);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const physician = { id: 123 };
        spyOn(physicianService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ physician });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(physicianService.update).toHaveBeenCalledWith(physician);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
