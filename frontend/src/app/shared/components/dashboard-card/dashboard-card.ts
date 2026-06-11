import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.css'
})
export class DashboardCard {

  @Input() title: string = '';
  @Input() count: number = 0;
  @Input() icon = '';
@Input() subtitle = '';

}