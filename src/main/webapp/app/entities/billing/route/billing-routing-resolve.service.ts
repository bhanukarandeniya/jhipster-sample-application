import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBilling, Billing } from '../billing.model';
import { BillingService } from '../service/billing.service';

@Injectable({ providedIn: 'root' })
export class BillingRoutingResolveService implements Resolve<IBilling> {
  constructor(protected service: BillingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBilling> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((billing: HttpResponse<Billing>) => {
          if (billing.body) {
            return of(billing.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Billing());
  }
}
