import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVisit, Visit } from '../visit.model';
import { VisitService } from '../service/visit.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IPhysician } from 'app/entities/physician/physician.model';
import { PhysicianService } from 'app/entities/physician/service/physician.service';

@Component({
  selector: 'jhi-visit-update',
  templateUrl: './visit-update.component.html',
})
export class VisitUpdateComponent implements OnInit {
  isSaving = false;

  patientsSharedCollection: IPatient[] = [];
  physiciansSharedCollection: IPhysician[] = [];

  editForm = this.fb.group({
    id: [],
    visitDateTime: [null, [Validators.required]],
    reason: [null, [Validators.required]],
    created: [null, [Validators.required]],
    modified: [],
    createdBy: [null, [Validators.required]],
    modifiedBy: [null, [Validators.required]],
    patientId: [],
    physicianId: [],
  });

  constructor(
    protected visitService: VisitService,
    protected patientService: PatientService,
    protected physicianService: PhysicianService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ visit }) => {
      this.updateForm(visit);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const visit = this.createFromForm();
    if (visit.id !== undefined) {
      this.subscribeToSaveResponse(this.visitService.update(visit));
    } else {
      this.subscribeToSaveResponse(this.visitService.create(visit));
    }
  }

  trackPatientById(index: number, item: IPatient): number {
    return item.id!;
  }

  trackPhysicianById(index: number, item: IPhysician): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVisit>>): void {
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

  protected updateForm(visit: IVisit): void {
    this.editForm.patchValue({
      id: visit.id,
      visitDateTime: visit.visitDateTime,
      reason: visit.reason,
      created: visit.created,
      modified: visit.modified,
      createdBy: visit.createdBy,
      modifiedBy: visit.modifiedBy,
      patientId: visit.patientId,
      physicianId: visit.physicianId,
    });

    this.patientsSharedCollection = this.patientService.addPatientToCollectionIfMissing(this.patientsSharedCollection, visit.patientId);
    this.physiciansSharedCollection = this.physicianService.addPhysicianToCollectionIfMissing(
      this.physiciansSharedCollection,
      visit.physicianId
    );
  }

  protected loadRelationshipsOptions(): void {
    this.patientService
      .query()
      .pipe(map((res: HttpResponse<IPatient[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatient[]) => this.patientService.addPatientToCollectionIfMissing(patients, this.editForm.get('patientId')!.value))
      )
      .subscribe((patients: IPatient[]) => (this.patientsSharedCollection = patients));

    this.physicianService
      .query()
      .pipe(map((res: HttpResponse<IPhysician[]>) => res.body ?? []))
      .pipe(
        map((physicians: IPhysician[]) =>
          this.physicianService.addPhysicianToCollectionIfMissing(physicians, this.editForm.get('physicianId')!.value)
        )
      )
      .subscribe((physicians: IPhysician[]) => (this.physiciansSharedCollection = physicians));
  }

  protected createFromForm(): IVisit {
    return {
      ...new Visit(),
      id: this.editForm.get(['id'])!.value,
      visitDateTime: this.editForm.get(['visitDateTime'])!.value,
      reason: this.editForm.get(['reason'])!.value,
      created: this.editForm.get(['created'])!.value,
      modified: this.editForm.get(['modified'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      modifiedBy: this.editForm.get(['modifiedBy'])!.value,
      patientId: this.editForm.get(['patientId'])!.value,
      physicianId: this.editForm.get(['physicianId'])!.value,
    };
  }
}
