import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ServicePackage } from '../models/service-package';

@Injectable({
  providedIn: 'root'
})
export class ServicePackageService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/servicePackages';

  getAllServices(): Observable<ServicePackage[]> {
    return this.http.get<ServicePackage[]>(this.apiUrl);
  }

  getServiceById(id: number): Observable<ServicePackage> {
    return this.http.get<ServicePackage>(
      `${this.apiUrl}/${id}`
    );
  }
}