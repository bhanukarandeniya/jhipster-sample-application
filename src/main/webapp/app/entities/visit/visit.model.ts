import * as dayjs from 'dayjs';
import { IPatient } from 'app/entities/patient/patient.model';
import { IPhysician } from 'app/entities/physician/physician.model';

export interface IVisit {
  id?: number;
  visitDateTime?: dayjs.Dayjs;
  reason?: string;
  created?: dayjs.Dayjs;
  modified?: dayjs.Dayjs | null;
  createdBy?: number;
  modifiedBy?: number;
  patientId?: IPatient | null;
  physicianId?: IPhysician | null;
}

export class Visit implements IVisit {
  constructor(
    public id?: number,
    public visitDateTime?: dayjs.Dayjs,
    public reason?: string,
    public created?: dayjs.Dayjs,
    public modified?: dayjs.Dayjs | null,
    public createdBy?: number,
    public modifiedBy?: number,
    public patientId?: IPatient | null,
    public physicianId?: IPhysician | null
  ) {}
}

export function getVisitIdentifier(visit: IVisit): number | undefined {
  return visit.id;
}
