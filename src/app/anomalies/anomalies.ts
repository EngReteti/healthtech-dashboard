import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnomalyService, AnomalyResult } from '../services/anomaly.service';
import { toFriendlyMessage } from '../utils/http-error.util';

@Component({
  selector: 'app-anomalies',
  imports: [CommonModule],
  templateUrl: './anomalies.html',
  styleUrl: './anomalies.css'
})
export class Anomalies implements OnInit {

  anomalies = signal<AnomalyResult[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');

  constructor(private anomalyService: AnomalyService) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.anomalyService.getAnomalies().subscribe({
      next: (data) => {
        // Most recent flagged movement first - the newest anomaly is 
        // usually the most relevant one to look at right now
        const sorted = [...data].sort((a, b) => b.movement.id - a.movement.id);
        this.anomalies.set(sorted);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }
}
