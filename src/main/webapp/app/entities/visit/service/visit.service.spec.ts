import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IVisit, Visit } from '../visit.model';

import { VisitService } from './visit.service';

describe('Service Tests', () => {
  describe('Visit Service', () => {
    let service: VisitService;
    let httpMock: HttpTestingController;
    let elemDefault: IVisit;
    let expectedResult: IVisit | IVisit[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(VisitService);
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

      it('should create a Visit', () => {
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

        service.create(new Visit()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Visit', () => {
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

      it('should partial update a Visit', () => {
        const patchObject = Object.assign(
          {
            reason: 'BBBBBB',
          },
          new Visit()
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

      it('should return a list of Visit', () => {
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

      it('should delete a Visit', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addVisitToCollectionIfMissing', () => {
        it('should add a Visit to an empty array', () => {
          const visit: IVisit = { id: 123 };
          expectedResult = service.addVisitToCollectionIfMissing([], visit);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(visit);
        });

        it('should not add a Visit to an array that contains it', () => {
          const visit: IVisit = { id: 123 };
          const visitCollection: IVisit[] = [
            {
              ...visit,
            },
            { id: 456 },
          ];
          expectedResult = service.addVisitToCollectionIfMissing(visitCollection, visit);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Visit to an array that doesn't contain it", () => {
          const visit: IVisit = { id: 123 };
          const visitCollection: IVisit[] = [{ id: 456 }];
          expectedResult = service.addVisitToCollectionIfMissing(visitCollection, visit);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(visit);
        });

        it('should add only unique Visit to an array', () => {
          const visitArray: IVisit[] = [{ id: 123 }, { id: 456 }, { id: 51473 }];
          const visitCollection: IVisit[] = [{ id: 123 }];
          expectedResult = service.addVisitToCollectionIfMissing(visitCollection, ...visitArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const visit: IVisit = { id: 123 };
          const visit2: IVisit = { id: 456 };
          expectedResult = service.addVisitToCollectionIfMissing([], visit, visit2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(visit);
          expect(expectedResult).toContain(visit2);
        });

        it('should accept null and undefined values', () => {
          const visit: IVisit = { id: 123 };
          expectedResult = service.addVisitToCollectionIfMissing([], null, visit, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(visit);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
