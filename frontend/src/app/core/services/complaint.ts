import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint } from '../models/complaint';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private apiUrl = 'http://localhost:3000/complaints';

  constructor(private http: HttpClient) {}

  getAllComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.apiUrl);
  }

  updateComplaint(id: number, complaint: Complaint): Observable<Complaint> {
    return this.http.put<Complaint>(
      `${this.apiUrl}/${id}`,
      complaint
    );
  }

}