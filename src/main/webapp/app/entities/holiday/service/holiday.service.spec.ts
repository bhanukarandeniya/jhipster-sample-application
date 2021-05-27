import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IHoliday, Holiday } from '../holiday.model';

import { HolidayService } from './holiday.service';

describe('Service Tests', () => {
  describe('Holiday Service', () => {
    let service: HolidayService;
    let httpMock: HttpTestingController;
    let elemDefault: IHoliday;
    let expectedResult: IHoliday | IHoliday[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(HolidayService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        visitDateTime: currentDate,
        reason: 'AAAAAAA',
        created: currentDate,
        modified: currentDate,
        createdBy: 0,
        modifiedBy: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            visitDateTime: currentDate.format(DATE_FORMAT),
            created: currentDate.format(DATE_FORMAT),
            modified: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Holiday', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            visitDateTime: currentDate.format(DATE_FORMAT),
            created: currentDate.format(DATE_FORMAT),
            modified: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            visitDateTime: currentDate,
            created: currentDate,
            modified: currentDate,
          },
          returnedFromService
        );

        service.create(new Holiday()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Holiday', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            visitDateTime: currentDate.format(DATE_FORMAT),
            reason: 'BBBBBB',
            created: currentDate.format(DATE_FORMAT),
            modified: currentDate.format(DATE_FORMAT),
            createdBy: 1,
            modifiedBy: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            visitDateTime: currentDate,
            created: currentDate,
            modified: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Holiday', () => {
        const patchObject = Object.assign(
          {
            visitDateTime: currentDate.format(DATE_FORMAT),
            created: currentDate.format(DATE_FORMAT),
          },
          new Holiday()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            visitDateTime: currentDate,
            created: currentDate,
            modified: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Holiday', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            visitDateTime: currentDate.format(DATE_FORMAT),
            reason: 'BBBBBB',
            created: currentDate.format(DATE_FORMAT),
            modified: currentDate.format(DATE_FORMAT),
            createdBy: 1,
            modifiedBy: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            visitDateTime: currentDate,
            created: currentDate,
            modified: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Holiday', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addHolidayToCollectionIfMissing', () => {
        it('should add a Holiday to an empty array', () => {
          const holiday: IHoliday = { id: 123 };
          expectedResult = service.addHolidayToCollectionIfMissing([], holiday);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(holiday);
        });

        it('should not add a Holiday to an array that contains it', () => {
          const holiday: IHoliday = { id: 123 };
          const holidayCollection: IHoliday[] = [
            {
              ...holiday,
            },
            { id: 456 },
          ];
          expectedResult = service.addHolidayToCollectionIfMissing(holidayCollection, holiday);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Holiday to an array that doesn't contain it", () => {
          const holiday: IHoliday = { id: 123 };
          const holidayCollection: IHoliday[] = [{ id: 456 }];
          expectedResult = service.addHolidayToCollectionIfMissing(holidayCollection, holiday);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(holiday);
        });

        it('should add only unique Holiday to an array', () => {
          const holidayArray: IHoliday[] = [{ id: 123 }, { id: 456 }, { id: 59969 }];
          const holidayCollection: IHoliday[] = [{ id: 123 }];
          expectedResult = service.addHolidayToCollectionIfMissing(holidayCollection, ...holidayArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const holiday: IHoliday = { id: 123 };
          const holiday2: IHoliday = { id: 456 };
          expectedResult = service.addHolidayToCollectionIfMissing([], holiday, holiday2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(holiday);
          expect(expectedResult).toContain(holiday2);
        });

        it('should accept null and undefined values', () => {
          const holiday: IHoliday = { id: 123 };
          expectedResult = service.addHolidayToCollectionIfMissing([], null, holiday, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(holiday);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
