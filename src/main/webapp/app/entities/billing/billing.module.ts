import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BillingComponent } from './list/billing.component';
import { BillingDetailComponent } from './detail/billing-detail.component';
import { BillingUpdateComponent } from './update/billing-update.component';
import { BillingDeleteDialogComponent } from './delete/billing-delete-dialog.component';
import { BillingRoutingModule } from './route/billing-routing.module';

@NgModule({
  imports: [SharedModule, BillingRoutingModule],
  declarations: [BillingComponent, BillingDetailComponent, BillingUpdateComponent, BillingDeleteDialogComponent],
  entryComponents: [BillingDeleteDialogComponent],
})
export class BillingModule {}
