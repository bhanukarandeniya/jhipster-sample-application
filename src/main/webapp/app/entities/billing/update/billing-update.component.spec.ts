jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BillingService } from '../service/billing.service';
import { IBilling, Billing } from '../billing.model';

import { BillingUpdateComponent } from './billing-update.component';

describe('Component Tests', () => {
  describe('Billing Management Update Component', () => {
    let comp: BillingUpdateComponent;
    let fixture: ComponentFixture<BillingUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let billingService: BillingService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BillingUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BillingUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BillingUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      billingService = TestBed.inject(BillingService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const billing: IBilling = { id: 456 };

        activatedRoute.data = of({ billing });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(billing));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const billing = { id: 123 };
        spyOn(billingService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ billing });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: billing }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(billingService.update).toHaveBeenCalledWith(billing);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const billing = new Billing();
        spyOn(billingService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ billing });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: billing }));
        saveSubject.complete();

        // THEN
        expect(billingService.create).toHaveBeenCalledWith(billing);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const billing = { id: 123 };
        spyOn(billingService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ billing });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(billingService.update).toHaveBeenCalledWith(billing);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
