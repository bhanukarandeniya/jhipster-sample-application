import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPhysician, Physician } from '../physician.model';
import { PhysicianService } from '../service/physician.service';

@Injectable({ providedIn: 'root' })
export class PhysicianRoutingResolveService implements Resolve<IPhysician> {
  constructor(protected service: PhysicianService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPhysician> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((physician: HttpResponse<Physician>) => {
          if (physician.body) {
            return of(physician.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Physician());
  }
}
