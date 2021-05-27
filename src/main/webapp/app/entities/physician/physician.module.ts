import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PhysicianComponent } from './list/physician.component';
import { PhysicianDetailComponent } from './detail/physician-detail.component';
import { PhysicianUpdateComponent } from './update/physician-update.component';
import { PhysicianDeleteDialogComponent } from './delete/physician-delete-dialog.component';
import { PhysicianRoutingModule } from './route/physician-routing.module';

@NgModule({
  imports: [SharedModule, PhysicianRoutingModule],
  declarations: [PhysicianComponent, PhysicianDetailComponent, PhysicianUpdateComponent, PhysicianDeleteDialogComponent],
  entryComponents: [PhysicianDeleteDialogComponent],
})
export class PhysicianModule {}
