jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBilling, Billing } from '../billing.model';
import { BillingService } from '../service/billing.service';

import { BillingRoutingResolveService } from './billing-routing-resolve.service';

describe('Service Tests', () => {
  describe('Billing routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: BillingRoutingResolveService;
    let service: BillingService;
    let resultBilling: IBilling | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(BillingRoutingResolveService);
      service = TestBed.inject(BillingService);
      resultBilling = undefined;
    });

    describe('resolve', () => {
      it('should return IBilling returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBilling = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBilling).toEqual({ id: 123 });
      });

      it('should return new IBilling if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBilling = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultBilling).toEqual(new Billing());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBilling = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBilling).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
