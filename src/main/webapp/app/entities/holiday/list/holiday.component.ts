import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IHoliday } from '../holiday.model';
import { HolidayService } from '../service/holiday.service';
import { HolidayDeleteDialogComponent } from '../delete/holiday-delete-dialog.component';

@Component({
  selector: 'jhi-holiday',
  templateUrl: './holiday.component.html',
})
export class HolidayComponent implements OnInit {
  holidays?: IHoliday[];
  isLoading = false;

  constructor(protected holidayService: HolidayService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.holidayService.query().subscribe(
      (res: HttpResponse<IHoliday[]>) => {
        this.isLoading = false;
        this.holidays = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IHoliday): number {
    return item.id!;
  }

  delete(holiday: IHoliday): void {
    const modalRef = this.modalService.open(HolidayDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.holiday = holiday;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
