import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBilling } from '../billing.model';

@Component({
  selector: 'jhi-billing-detail',
  templateUrl: './billing-detail.component.html',
})
export class BillingDetailComponent implements OnInit {
  billing: IBilling | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ billing }) => {
      this.billing = billing;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
