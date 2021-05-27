import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPatient, getPatientIdentifier } from '../patient.model';

export type EntityResponseType = HttpResponse<IPatient>;
export type EntityArrayResponseType = HttpResponse<IPatient[]>;

@Injectable({ providedIn: 'root' })
export class PatientService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/patients');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(patient: IPatient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(patient);
    return this.http
      .post<IPatient>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(patient: IPatient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(patient);
    return this.http
      .put<IPatient>(`${this.resourceUrl}/${getPatientIdentifier(patient) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(patient: IPatient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(patient);
    return this.http
      .patch<IPatient>(`${this.resourceUrl}/${getPatientIdentifier(patient) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPatient>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPatient[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPatientToCollectionIfMissing(patientCollection: IPatient[], ...patientsToCheck: (IPatient | null | undefined)[]): IPatient[] {
    const patients: IPatient[] = patientsToCheck.filter(isPresent);
    if (patients.length > 0) {
      const patientCollectionIdentifiers = patientCollection.map(patientItem => getPatientIdentifier(patientItem)!);
      const patientsToAdd = patients.filter(patientItem => {
        const patientIdentifier = getPatientIdentifier(patientItem);
        if (patientIdentifier == null || patientCollectionIdentifiers.includes(patientIdentifier)) {
          return false;
        }
        patientCollectionIdentifiers.push(patientIdentifier);
        return true;
      });
      return [...patientsToAdd, ...patientCollection];
    }
    return patientCollection;
  }

  protected convertDateFromClient(patient: IPatient): IPatient {
    return Object.assign({}, patient, {
      dob: patient.dob?.isValid() ? patient.dob.format(DATE_FORMAT) : undefined,
      created: patient.created?.isValid() ? patient.created.format(DATE_FORMAT) : undefined,
      modified: patient.modified?.isValid() ? patient.modified.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dob = res.body.dob ? dayjs(res.body.dob) : undefined;
      res.body.created = res.body.created ? dayjs(res.body.created) : undefined;
      res.body.modified = res.body.modified ? dayjs(res.body.modified) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((patient: IPatient) => {
        patient.dob = patient.dob ? dayjs(patient.dob) : undefined;
        patient.created = patient.created ? dayjs(patient.created) : undefined;
        patient.modified = patient.modified ? dayjs(patient.modified) : undefined;
      });
    }
    return res;
  }
}
