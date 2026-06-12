import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-service-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './service-card.html',
  styleUrl: './service-card.css'
})
export class ServiceCardComponent {

  @Input()
  service: any;

}