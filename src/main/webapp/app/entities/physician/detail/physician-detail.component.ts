import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPhysician } from '../physician.model';

@Component({
  selector: 'jhi-physician-detail',
  templateUrl: './physician-detail.component.html',
})
export class PhysicianDetailComponent implements OnInit {
  physician: IPhysician | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ physician }) => {
      this.physician = physician;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
