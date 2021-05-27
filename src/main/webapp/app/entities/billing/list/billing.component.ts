import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBilling } from '../billing.model';
import { BillingService } from '../service/billing.service';
import { BillingDeleteDialogComponent } from '../delete/billing-delete-dialog.component';

@Component({
  selector: 'jhi-billing',
  templateUrl: './billing.component.html',
})
export class BillingComponent implements OnInit {
  billings?: IBilling[];
  isLoading = false;

  constructor(protected billingService: BillingService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.billingService.query().subscribe(
      (res: HttpResponse<IBilling[]>) => {
        this.isLoading = false;
        this.billings = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBilling): number {
    return item.id!;
  }

  delete(billing: IBilling): void {
    const modalRef = this.modalService.open(BillingDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.billing = billing;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
