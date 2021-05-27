import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBilling, getBillingIdentifier } from '../billing.model';

export type EntityResponseType = HttpResponse<IBilling>;
export type EntityArrayResponseType = HttpResponse<IBilling[]>;

@Injectable({ providedIn: 'root' })
export class BillingService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/billings');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(billing: IBilling): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(billing);
    return this.http
      .post<IBilling>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(billing: IBilling): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(billing);
    return this.http
      .put<IBilling>(`${this.resourceUrl}/${getBillingIdentifier(billing) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(billing: IBilling): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(billing);
    return this.http
      .patch<IBilling>(`${this.resourceUrl}/${getBillingIdentifier(billing) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBilling>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBilling[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBillingToCollectionIfMissing(billingCollection: IBilling[], ...billingsToCheck: (IBilling | null | undefined)[]): IBilling[] {
    const billings: IBilling[] = billingsToCheck.filter(isPresent);
    if (billings.length > 0) {
      const billingCollectionIdentifiers = billingCollection.map(billingItem => getBillingIdentifier(billingItem)!);
      const billingsToAdd = billings.filter(billingItem => {
        const billingIdentifier = getBillingIdentifier(billingItem);
        if (billingIdentifier == null || billingCollectionIdentifiers.includes(billingIdentifier)) {
          return false;
        }
        billingCollectionIdentifiers.push(billingIdentifier);
        return true;
      });
      return [...billingsToAdd, ...billingCollection];
    }
    return billingCollection;
  }

  protected convertDateFromClient(billing: IBilling): IBilling {
    return Object.assign({}, billing, {
      billed: billing.billed?.isValid() ? billing.billed.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.billed = res.body.billed ? dayjs(res.body.billed) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((billing: IBilling) => {
        billing.billed = billing.billed ? dayjs(billing.billed) : undefined;
      });
    }
    return res;
  }
}
