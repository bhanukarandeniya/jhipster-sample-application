import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBilling } from '../billing.model';
import { BillingService } from '../service/billing.service';

@Component({
  templateUrl: './billing-delete-dialog.component.html',
})
export class BillingDeleteDialogComponent {
  billing?: IBilling;

  constructor(protected billingService: BillingService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.billingService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
