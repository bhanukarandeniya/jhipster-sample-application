import * as dayjs from 'dayjs';

export interface IHoliday {
  id?: number;
  visitDateTime?: dayjs.Dayjs;
  reason?: string;
  created?: dayjs.Dayjs;
  modified?: dayjs.Dayjs | null;
  createdBy?: number;
  modifiedBy?: number;
}

export class Holiday implements IHoliday {
  constructor(
    public id?: number,
    public visitDateTime?: dayjs.Dayjs,
    public reason?: string,
    public created?: dayjs.Dayjs,
    public modified?: dayjs.Dayjs | null,
    public createdBy?: number,
    public modifiedBy?: number
  ) {}
}

export function getHolidayIdentifier(holiday: IHoliday): number | undefined {
  return holiday.id;
}
