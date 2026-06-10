import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, RouterModule } from '@angular/router';

import { ServicePackageService } from '../../../core/services/service-package';

import { ServicePackage } from '../../../core/models/service-package';

@Component({
  selector: 'app-service-details',
  imports:[
    CommonModule,
    RouterModule
  ],
  templateUrl:'./service-details.html',
  styleUrl:'./service-details.css'
})
export class ServiceDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);

  private serviceApi = inject(ServicePackageService);

  service!:ServicePackage;

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.serviceApi
      .getServiceById(id)
      .subscribe(data => {
        this.service = data;
      });

  }

}