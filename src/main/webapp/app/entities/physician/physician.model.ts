import * as dayjs from 'dayjs';
import { IVisit } from 'app/entities/visit/visit.model';

export interface IPhysician {
  id?: number;
  physicianId?: string;
  name?: string;
  created?: dayjs.Dayjs;
  modified?: dayjs.Dayjs | null;
  createdBy?: number;
  modifiedBy?: number;
  visits?: IVisit[] | null;
}

export class Physician implements IPhysician {
  constructor(
    public id?: number,
    public physicianId?: string,
    public name?: string,
    public created?: dayjs.Dayjs,
    public modified?: dayjs.Dayjs | null,
    public createdBy?: number,
    public modifiedBy?: number,
    public visits?: IVisit[] | null
  ) {}
}

export function getPhysicianIdentifier(physician: IPhysician): number | undefined {
  return physician.id;
}
