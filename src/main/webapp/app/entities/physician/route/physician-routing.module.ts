import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PhysicianComponent } from '../list/physician.component';
import { PhysicianDetailComponent } from '../detail/physician-detail.component';
import { PhysicianUpdateComponent } from '../update/physician-update.component';
import { PhysicianRoutingResolveService } from './physician-routing-resolve.service';

const physicianRoute: Routes = [
  {
    path: '',
    component: PhysicianComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PhysicianDetailComponent,
    resolve: {
      physician: PhysicianRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PhysicianUpdateComponent,
    resolve: {
      physician: PhysicianRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PhysicianUpdateComponent,
    resolve: {
      physician: PhysicianRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(physicianRoute)],
  exports: [RouterModule],
})
export class PhysicianRoutingModule {}
