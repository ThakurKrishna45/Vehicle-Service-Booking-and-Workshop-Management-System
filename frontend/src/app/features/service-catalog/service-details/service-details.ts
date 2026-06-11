import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ServicePackageService } from '../../../core/services/service-package';

@Component({
  selector: 'app-service-details',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './service-details.html',
  styleUrl: './service-details.css'
})
export class ServiceDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private serviceApi = inject(ServicePackageService);

  service = signal<any | null>(null);

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    this.serviceApi
      .getServiceById(Number(id))
      .subscribe(data => {

        console.log('Service:', data);

        this.service.set(data);

      });

  }

}