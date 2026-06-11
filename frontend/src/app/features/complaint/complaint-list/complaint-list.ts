import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
 selector:'app-complaint-list',
 standalone:true,
 imports:[CommonModule],
 templateUrl:'./complaint-list.html',
 styleUrls:['./complaint-list.css']
})
export class ComplaintList {

 complaints = [

 {
  id:1,
  bookingId:101,
  subject:'Brake Issue',
  status:'OPEN'
 },

 {
  id:2,
  bookingId:102,
  subject:'Late Delivery',
  status:'IN REVIEW'
 },

 {
  id:3,
  bookingId:103,
  subject:'Engine Noise',
  status:'RESOLVED'
 }

 ];

}