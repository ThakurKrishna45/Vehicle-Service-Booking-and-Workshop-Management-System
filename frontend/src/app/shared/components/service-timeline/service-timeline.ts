import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Re-export so consumers can import the type from one place
export interface ServiceStage {
  label: string;
  status: 'completed' | 'active' | 'pending';
  timestamp?: string;
}

@Component({
  selector: 'app-service-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-timeline.html',
  styleUrl: './service-timeline.css'
})
export class ServiceTimeline {

  /** Rich stage objects with status + optional timestamp */
  @Input() stages: ServiceStage[] = [];

}
