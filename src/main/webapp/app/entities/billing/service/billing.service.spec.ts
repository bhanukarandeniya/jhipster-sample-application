import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IBilling, Billing } from '../billing.model';

import { BillingService } from './billing.service';

describe('Service Tests', () => {
  describe('Billing Service', () => {
    let service: BillingService;
    let httpMock: HttpTestingController;
    let elemDefault: IBilling;
    let expectedResult: IBilling | IBilling[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BillingService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        visitId: 0,
        patientId: 'AAAAAAA',
        physicianId: 'AAAAAAA',
        billed: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            billed: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Billing', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            billed: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            billed: currentDate,
          },
          returnedFromService
        );

        service.create(new Billing()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Billing', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            visitId: 1,
            patientId: 'BBBBBB',
            physicianId: 'BBBBBB',
            billed: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            billed: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Billing', () => {
        const patchObject = Object.assign(
          {
            patientId: 'BBBBBB',
            billed: currentDate.format(DATE_FORMAT),
          },
          new Billing()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            billed: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Billing', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            visitId: 1,
            patientId: 'BBBBBB',
            physicianId: 'BBBBBB',
            billed: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            billed: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Billing', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBillingToCollectionIfMissing', () => {
        it('should add a Billing to an empty array', () => {
          const billing: IBilling = { id: 123 };
          expectedResult = service.addBillingToCollectionIfMissing([], billing);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(billing);
        });

        it('should not add a Billing to an array that contains it', () => {
          const billing: IBilling = { id: 123 };
          const billingCollection: IBilling[] = [
            {
              ...billing,
            },
            { id: 456 },
          ];
          expectedResult = service.addBillingToCollectionIfMissing(billingCollection, billing);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Billing to an array that doesn't contain it", () => {
          const billing: IBilling = { id: 123 };
          const billingCollection: IBilling[] = [{ id: 456 }];
          expectedResult = service.addBillingToCollectionIfMissing(billingCollection, billing);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(billing);
        });

        it('should add only unique Billing to an array', () => {
          const billingArray: IBilling[] = [{ id: 123 }, { id: 456 }, { id: 29935 }];
          const billingCollection: IBilling[] = [{ id: 123 }];
          expectedResult = service.addBillingToCollectionIfMissing(billingCollection, ...billingArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const billing: IBilling = { id: 123 };
          const billing2: IBilling = { id: 456 };
          expectedResult = service.addBillingToCollectionIfMissing([], billing, billing2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(billing);
          expect(expectedResult).toContain(billing2);
        });

        it('should accept null and undefined values', () => {
          const billing: IBilling = { id: 123 };
          expectedResult = service.addBillingToCollectionIfMissing([], null, billing, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(billing);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
