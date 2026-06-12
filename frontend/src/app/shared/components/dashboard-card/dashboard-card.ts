import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.css'
})
export class DashboardCard {

  title    = input<string>('');
  count    = input<number>(0);
  icon     = input<string>('');
  subtitle = input<string>('');

}