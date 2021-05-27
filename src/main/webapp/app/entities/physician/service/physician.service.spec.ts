import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPhysician, Physician } from '../physician.model';

import { PhysicianService } from './physician.service';

describe('Service Tests', () => {
  describe('Physician Service', () => {
    let service: PhysicianService;
    let httpMock: HttpTestingController;
    let elemDefault: IPhysician;
    let expectedResult: IPhysician | IPhysician[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PhysicianService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        physicianId: 'AAAAAAA',
        name: 'AAAAAAA',
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

      it('should create a Physician', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            created: currentDate.format(DATE_FORMAT),
            modified: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            created: currentDate,
            modified: currentDate,
          },
          returnedFromService
        );

        service.create(new Physician()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Physician', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            physicianId: 'BBBBBB',
            name: 'BBBBBB',
            created: currentDate.format(DATE_FORMAT),
            modified: currentDate.format(DATE_FORMAT),
            createdBy: 1,
            modifiedBy: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
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

      it('should partial update a Physician', () => {
        const patchObject = Object.assign(
          {
            physicianId: 'BBBBBB',
            createdBy: 1,
            modifiedBy: 1,
          },
          new Physician()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
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

      it('should return a list of Physician', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            physicianId: 'BBBBBB',
            name: 'BBBBBB',
            created: currentDate.format(DATE_FORMAT),
            modified: currentDate.format(DATE_FORMAT),
            createdBy: 1,
            modifiedBy: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
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

      it('should delete a Physician', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPhysicianToCollectionIfMissing', () => {
        it('should add a Physician to an empty array', () => {
          const physician: IPhysician = { id: 123 };
          expectedResult = service.addPhysicianToCollectionIfMissing([], physician);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(physician);
        });

        it('should not add a Physician to an array that contains it', () => {
          const physician: IPhysician = { id: 123 };
          const physicianCollection: IPhysician[] = [
            {
              ...physician,
            },
            { id: 456 },
          ];
          expectedResult = service.addPhysicianToCollectionIfMissing(physicianCollection, physician);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Physician to an array that doesn't contain it", () => {
          const physician: IPhysician = { id: 123 };
          const physicianCollection: IPhysician[] = [{ id: 456 }];
          expectedResult = service.addPhysicianToCollectionIfMissing(physicianCollection, physician);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(physician);
        });

        it('should add only unique Physician to an array', () => {
          const physicianArray: IPhysician[] = [{ id: 123 }, { id: 456 }, { id: 7039 }];
          const physicianCollection: IPhysician[] = [{ id: 123 }];
          expectedResult = service.addPhysicianToCollectionIfMissing(physicianCollection, ...physicianArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const physician: IPhysician = { id: 123 };
          const physician2: IPhysician = { id: 456 };
          expectedResult = service.addPhysicianToCollectionIfMissing([], physician, physician2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(physician);
          expect(expectedResult).toContain(physician2);
        });

        it('should accept null and undefined values', () => {
          const physician: IPhysician = { id: 123 };
          expectedResult = service.addPhysicianToCollectionIfMissing([], null, physician, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(physician);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
