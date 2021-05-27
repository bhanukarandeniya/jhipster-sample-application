import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BillingComponent } from '../list/billing.component';
import { BillingDetailComponent } from '../detail/billing-detail.component';
import { BillingUpdateComponent } from '../update/billing-update.component';
import { BillingRoutingResolveService } from './billing-routing-resolve.service';

const billingRoute: Routes = [
  {
    path: '',
    component: BillingComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BillingDetailComponent,
    resolve: {
      billing: BillingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BillingUpdateComponent,
    resolve: {
      billing: BillingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BillingUpdateComponent,
    resolve: {
      billing: BillingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(billingRoute)],
  exports: [RouterModule],
})
export class BillingRoutingModule {}
