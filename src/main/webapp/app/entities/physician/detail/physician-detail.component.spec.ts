import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PhysicianDetailComponent } from './physician-detail.component';

describe('Component Tests', () => {
  describe('Physician Management Detail Component', () => {
    let comp: PhysicianDetailComponent;
    let fixture: ComponentFixture<PhysicianDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PhysicianDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ physician: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PhysicianDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PhysicianDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load physician on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.physician).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
