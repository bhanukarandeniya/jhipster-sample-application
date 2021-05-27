import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'patient',
        data: { pageTitle: 'jhipsterSampleApplicationApp.patient.home.title' },
        loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule),
      },
      {
        path: 'physician',
        data: { pageTitle: 'jhipsterSampleApplicationApp.physician.home.title' },
        loadChildren: () => import('./physician/physician.module').then(m => m.PhysicianModule),
      },
      {
        path: 'visit',
        data: { pageTitle: 'jhipsterSampleApplicationApp.visit.home.title' },
        loadChildren: () => import('./visit/visit.module').then(m => m.VisitModule),
      },
      {
        path: 'holiday',
        data: { pageTitle: 'jhipsterSampleApplicationApp.holiday.home.title' },
        loadChildren: () => import('./holiday/holiday.module').then(m => m.HolidayModule),
      },
      {
        path: 'billing',
        data: { pageTitle: 'jhipsterSampleApplicationApp.billing.home.title' },
        loadChildren: () => import('./billing/billing.module').then(m => m.BillingModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
