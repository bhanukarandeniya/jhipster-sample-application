import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IBilling, Billing } from '../billing.model';
import { BillingService } from '../service/billing.service';

@Component({
  selector: 'jhi-billing-update',
  templateUrl: './billing-update.component.html',
})
export class BillingUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    visitId: [null, [Validators.required]],
    patientId: [],
    physicianId: [null, [Validators.required]],
    billed: [null, [Validators.required]],
  });

  constructor(protected billingService: BillingService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ billing }) => {
      this.updateForm(billing);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const billing = this.createFromForm();
    if (billing.id !== undefined) {
      this.subscribeToSaveResponse(this.billingService.update(billing));
    } else {
      this.subscribeToSaveResponse(this.billingService.create(billing));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBilling>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(billing: IBilling): void {
    this.editForm.patchValue({
      id: billing.id,
      visitId: billing.visitId,
      patientId: billing.patientId,
      physicianId: billing.physicianId,
      billed: billing.billed,
    });
  }

  protected createFromForm(): IBilling {
    return {
      ...new Billing(),
      id: this.editForm.get(['id'])!.value,
      visitId: this.editForm.get(['visitId'])!.value,
      patientId: this.editForm.get(['patientId'])!.value,
      physicianId: this.editForm.get(['physicianId'])!.value,
      billed: this.editForm.get(['billed'])!.value,
    };
  }
}
