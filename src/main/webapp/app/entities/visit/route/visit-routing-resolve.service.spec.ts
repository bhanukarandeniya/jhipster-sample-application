jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IVisit, Visit } from '../visit.model';
import { VisitService } from '../service/visit.service';

import { VisitRoutingResolveService } from './visit-routing-resolve.service';

describe('Service Tests', () => {
  describe('Visit routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: VisitRoutingResolveService;
    let service: VisitService;
    let resultVisit: IVisit | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(VisitRoutingResolveService);
      service = TestBed.inject(VisitService);
      resultVisit = undefined;
    });

    describe('resolve', () => {
      it('should return IVisit returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVisit = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVisit).toEqual({ id: 123 });
      });

      it('should return new IVisit if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVisit = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultVisit).toEqual(new Visit());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVisit = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVisit).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
