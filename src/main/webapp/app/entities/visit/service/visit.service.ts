import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVisit, getVisitIdentifier } from '../visit.model';

export type EntityResponseType = HttpResponse<IVisit>;
export type EntityArrayResponseType = HttpResponse<IVisit[]>;

@Injectable({ providedIn: 'root' })
export class VisitService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/visits');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(visit: IVisit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(visit);
    return this.http
      .post<IVisit>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(visit: IVisit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(visit);
    return this.http
      .put<IVisit>(`${this.resourceUrl}/${getVisitIdentifier(visit) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(visit: IVisit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(visit);
    return this.http
      .patch<IVisit>(`${this.resourceUrl}/${getVisitIdentifier(visit) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IVisit>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IVisit[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVisitToCollectionIfMissing(visitCollection: IVisit[], ...visitsToCheck: (IVisit | null | undefined)[]): IVisit[] {
    const visits: IVisit[] = visitsToCheck.filter(isPresent);
    if (visits.length > 0) {
      const visitCollectionIdentifiers = visitCollection.map(visitItem => getVisitIdentifier(visitItem)!);
      const visitsToAdd = visits.filter(visitItem => {
        const visitIdentifier = getVisitIdentifier(visitItem);
        if (visitIdentifier == null || visitCollectionIdentifiers.includes(visitIdentifier)) {
          return false;
        }
        visitCollectionIdentifiers.push(visitIdentifier);
        return true;
      });
      return [...visitsToAdd, ...visitCollection];
    }
    return visitCollection;
  }

  protected convertDateFromClient(visit: IVisit): IVisit {
    return Object.assign({}, visit, {
      visitDateTime: visit.visitDateTime?.isValid() ? visit.visitDateTime.format(DATE_FORMAT) : undefined,
      created: visit.created?.isValid() ? visit.created.format(DATE_FORMAT) : undefined,
      modified: visit.modified?.isValid() ? visit.modified.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.visitDateTime = res.body.visitDateTime ? dayjs(res.body.visitDateTime) : undefined;
      res.body.created = res.body.created ? dayjs(res.body.created) : undefined;
      res.body.modified = res.body.modified ? dayjs(res.body.modified) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((visit: IVisit) => {
        visit.visitDateTime = visit.visitDateTime ? dayjs(visit.visitDateTime) : undefined;
        visit.created = visit.created ? dayjs(visit.created) : undefined;
        visit.modified = visit.modified ? dayjs(visit.modified) : undefined;
      });
    }
    return res;
  }
}
