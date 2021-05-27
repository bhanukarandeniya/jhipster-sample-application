import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IHoliday, Holiday } from '../holiday.model';
import { HolidayService } from '../service/holiday.service';

@Component({
  selector: 'jhi-holiday-update',
  templateUrl: './holiday-update.component.html',
})
export class HolidayUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    visitDateTime: [null, [Validators.required]],
    reason: [null, [Validators.required]],
    created: [null, [Validators.required]],
    modified: [],
    createdBy: [null, [Validators.required]],
    modifiedBy: [null, [Validators.required]],
  });

  constructor(protected holidayService: HolidayService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ holiday }) => {
      this.updateForm(holiday);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const holiday = this.createFromForm();
    if (holiday.id !== undefined) {
      this.subscribeToSaveResponse(this.holidayService.update(holiday));
    } else {
      this.subscribeToSaveResponse(this.holidayService.create(holiday));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHoliday>>): void {
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

  protected updateForm(holiday: IHoliday): void {
    this.editForm.patchValue({
      id: holiday.id,
      visitDateTime: holiday.visitDateTime,
      reason: holiday.reason,
      created: holiday.created,
      modified: holiday.modified,
      createdBy: holiday.createdBy,
      modifiedBy: holiday.modifiedBy,
    });
  }

  protected createFromForm(): IHoliday {
    return {
      ...new Holiday(),
      id: this.editForm.get(['id'])!.value,
      visitDateTime: this.editForm.get(['visitDateTime'])!.value,
      reason: this.editForm.get(['reason'])!.value,
      created: this.editForm.get(['created'])!.value,
      modified: this.editForm.get(['modified'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      modifiedBy: this.editForm.get(['modifiedBy'])!.value,
    };
  }
}
