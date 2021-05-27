import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPhysician, getPhysicianIdentifier } from '../physician.model';

export type EntityResponseType = HttpResponse<IPhysician>;
export type EntityArrayResponseType = HttpResponse<IPhysician[]>;

@Injectable({ providedIn: 'root' })
export class PhysicianService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/physicians');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(physician: IPhysician): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(physician);
    return this.http
      .post<IPhysician>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(physician: IPhysician): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(physician);
    return this.http
      .put<IPhysician>(`${this.resourceUrl}/${getPhysicianIdentifier(physician) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(physician: IPhysician): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(physician);
    return this.http
      .patch<IPhysician>(`${this.resourceUrl}/${getPhysicianIdentifier(physician) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPhysician>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPhysician[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPhysicianToCollectionIfMissing(
    physicianCollection: IPhysician[],
    ...physiciansToCheck: (IPhysician | null | undefined)[]
  ): IPhysician[] {
    const physicians: IPhysician[] = physiciansToCheck.filter(isPresent);
    if (physicians.length > 0) {
      const physicianCollectionIdentifiers = physicianCollection.map(physicianItem => getPhysicianIdentifier(physicianItem)!);
      const physiciansToAdd = physicians.filter(physicianItem => {
        const physicianIdentifier = getPhysicianIdentifier(physicianItem);
        if (physicianIdentifier == null || physicianCollectionIdentifiers.includes(physicianIdentifier)) {
          return false;
        }
        physicianCollectionIdentifiers.push(physicianIdentifier);
        return true;
      });
      return [...physiciansToAdd, ...physicianCollection];
    }
    return physicianCollection;
  }

  protected convertDateFromClient(physician: IPhysician): IPhysician {
    return Object.assign({}, physician, {
      created: physician.created?.isValid() ? physician.created.format(DATE_FORMAT) : undefined,
      modified: physician.modified?.isValid() ? physician.modified.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.created = res.body.created ? dayjs(res.body.created) : undefined;
      res.body.modified = res.body.modified ? dayjs(res.body.modified) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((physician: IPhysician) => {
        physician.created = physician.created ? dayjs(physician.created) : undefined;
        physician.modified = physician.modified ? dayjs(physician.modified) : undefined;
      });
    }
    return res;
  }
}
