import * as dayjs from 'dayjs';

export interface IBilling {
  id?: number;
  visitId?: number;
  patientId?: string | null;
  physicianId?: string;
  billed?: dayjs.Dayjs;
}

export class Billing implements IBilling {
  constructor(
    public id?: number,
    public visitId?: number,
    public patientId?: string | null,
    public physicianId?: string,
    public billed?: dayjs.Dayjs
  ) {}
}

export function getBillingIdentifier(billing: IBilling): number | undefined {
  return billing.id;
}
