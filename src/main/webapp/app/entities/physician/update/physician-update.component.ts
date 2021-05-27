import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPhysician, Physician } from '../physician.model';
import { PhysicianService } from '../service/physician.service';

@Component({
  selector: 'jhi-physician-update',
  templateUrl: './physician-update.component.html',
})
export class PhysicianUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    physicianId: [null, [Validators.required]],
    name: [null, [Validators.required]],
    created: [null, [Validators.required]],
    modified: [],
    createdBy: [null, [Validators.required]],
    modifiedBy: [null, [Validators.required]],
  });

  constructor(protected physicianService: PhysicianService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ physician }) => {
      this.updateForm(physician);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const physician = this.createFromForm();
    if (physician.id !== undefined) {
      this.subscribeToSaveResponse(this.physicianService.update(physician));
    } else {
      this.subscribeToSaveResponse(this.physicianService.create(physician));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPhysician>>): void {
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

  protected updateForm(physician: IPhysician): void {
    this.editForm.patchValue({
      id: physician.id,
      physicianId: physician.physicianId,
      name: physician.name,
      created: physician.created,
      modified: physician.modified,
      createdBy: physician.createdBy,
      modifiedBy: physician.modifiedBy,
    });
  }

  protected createFromForm(): IPhysician {
    return {
      ...new Physician(),
      id: this.editForm.get(['id'])!.value,
      physicianId: this.editForm.get(['physicianId'])!.value,
      name: this.editForm.get(['name'])!.value,
      created: this.editForm.get(['created'])!.value,
      modified: this.editForm.get(['modified'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      modifiedBy: this.editForm.get(['modifiedBy'])!.value,
    };
  }
}
