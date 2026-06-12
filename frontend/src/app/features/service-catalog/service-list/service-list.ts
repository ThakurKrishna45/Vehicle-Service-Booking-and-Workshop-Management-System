import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Store } from '@ngrx/store';

import {
  setSearchText,
  setCategory
} from '../../../store/service-filter/service-filter.actions';

import { ServicePackageService } from '../../../core/services/service-package';

import { ServiceCardComponent } from '../../../shared/components/service-card/service-card';

@Component({
  selector: 'app-service-list',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ServiceCardComponent
  ],
  templateUrl: './service-list.html',
  styleUrl: './service-list.css'
})
export class ServiceListComponent implements OnInit {

  private serviceApi = inject(ServicePackageService);

  private store = inject(Store);

  services = signal<any[]>([]);

  searchText = '';

  selectedCategory = '';

  ngOnInit(): void {

    this.serviceApi.getAllServices().subscribe(data => {

      this.services.set(data);

    });

  }

  onSearchChange() {

    this.store.dispatch(

      setSearchText({

        searchText: this.searchText

      })

    );

  }

  onCategoryChange() {

    this.store.dispatch(

      setCategory({

        category: this.selectedCategory

      })

    );

  }

  get filteredServices() {

    return this.services().filter(service => {

      const matchesSearch =

        service.name
          .toLowerCase()
          .includes(
            this.searchText.toLowerCase()
          );

      const matchesCategory =

        !this.selectedCategory ||

        service.category ===
        this.selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );

    });

  }

}