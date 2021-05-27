import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { HolidayService } from '../service/holiday.service';

import { HolidayComponent } from './holiday.component';

describe('Component Tests', () => {
  describe('Holiday Management Component', () => {
    let comp: HolidayComponent;
    let fixture: ComponentFixture<HolidayComponent>;
    let service: HolidayService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [HolidayComponent],
      })
        .overrideTemplate(HolidayComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(HolidayComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(HolidayService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.holidays?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
