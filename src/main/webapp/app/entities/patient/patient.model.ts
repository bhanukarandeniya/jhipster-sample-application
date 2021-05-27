import * as dayjs from 'dayjs';
import { IVisit } from 'app/entities/visit/visit.model';

export interface IPatient {
  id?: number;
  patientId?: string;
  name?: string;
  dob?: dayjs.Dayjs;
  gender?: number;
  created?: dayjs.Dayjs;
  modified?: dayjs.Dayjs | null;
  createdBy?: number;
  visits?: IVisit[] | null;
}

export class Patient implements IPatient {
  constructor(
    public id?: number,
    public patientId?: string,
    public name?: string,
    public dob?: dayjs.Dayjs,
    public gender?: number,
    public created?: dayjs.Dayjs,
    public modified?: dayjs.Dayjs | null,
    public createdBy?: number,
    public visits?: IVisit[] | null
  ) {}
}

export function getPatientIdentifier(patient: IPatient): number | undefined {
  return patient.id;
}
