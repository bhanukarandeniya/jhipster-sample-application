import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BillingDetailComponent } from './billing-detail.component';

describe('Component Tests', () => {
  describe('Billing Management Detail Component', () => {
    let comp: BillingDetailComponent;
    let fixture: ComponentFixture<BillingDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BillingDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ billing: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BillingDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BillingDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load billing on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.billing).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
