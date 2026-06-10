import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServicePackageService } from '../../../core/services/service-package';
import { ServicePackage } from '../../../core/models/service-package';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './service-list.html',
  styleUrl: './service-list.css'
})
export class ServiceListComponent implements OnInit {

  private serviceApi = inject(ServicePackageService);

  services: ServicePackage[] = [];

  filteredServices: ServicePackage[] = [];

  searchText = '';

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices() {
    this.serviceApi.getAllServices().subscribe(data => {
      this.services = data;
      this.filteredServices = data;
    });
  }

  search() {

    this.filteredServices = this.services.filter(service =>
      service.name.toLowerCase()
      .includes(this.searchText.toLowerCase())
    );

  }

}