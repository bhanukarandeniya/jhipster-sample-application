jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPhysician, Physician } from '../physician.model';
import { PhysicianService } from '../service/physician.service';

import { PhysicianRoutingResolveService } from './physician-routing-resolve.service';

describe('Service Tests', () => {
  describe('Physician routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PhysicianRoutingResolveService;
    let service: PhysicianService;
    let resultPhysician: IPhysician | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PhysicianRoutingResolveService);
      service = TestBed.inject(PhysicianService);
      resultPhysician = undefined;
    });

    describe('resolve', () => {
      it('should return IPhysician returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPhysician = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPhysician).toEqual({ id: 123 });
      });

      it('should return new IPhysician if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPhysician = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPhysician).toEqual(new Physician());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPhysician = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPhysician).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
