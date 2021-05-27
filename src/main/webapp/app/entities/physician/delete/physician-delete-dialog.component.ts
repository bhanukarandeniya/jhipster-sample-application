import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPhysician } from '../physician.model';
import { PhysicianService } from '../service/physician.service';

@Component({
  templateUrl: './physician-delete-dialog.component.html',
})
export class PhysicianDeleteDialogComponent {
  physician?: IPhysician;

  constructor(protected physicianService: PhysicianService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.physicianService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
