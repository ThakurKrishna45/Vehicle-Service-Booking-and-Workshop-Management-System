import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
 selector:'app-manage-status',
 standalone:true,
 imports:[CommonModule,FormsModule],
 templateUrl:'./manage-status.html',
 styleUrls:['./manage-status.css']
})
export class ManageStatus {

 selectedStatus='RECEIVED';

 statuses = [
  'RECEIVED',
  'INSPECTION',
  'REPAIR',
  'QUALITY_CHECK',
  'READY_FOR_DELIVERY',
  'COMPLETED'
 ];

}