jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { VisitService } from '../service/visit.service';

import { VisitDeleteDialogComponent } from './visit-delete-dialog.component';

describe('Component Tests', () => {
  describe('Visit Management Delete Component', () => {
    let comp: VisitDeleteDialogComponent;
    let fixture: ComponentFixture<VisitDeleteDialogComponent>;
    let service: VisitService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VisitDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(VisitDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(VisitDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(VisitService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
