import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockMovementService, StockMovementRecord } from '../services/stock-movement.service';

@Component({
  selector: 'app-movement-history',
  imports: [CommonModule],
  templateUrl: './movement-history.html',
  styleUrl: './movement-history.css'
})
export class MovementHistory implements OnInit {

  movements = signal<StockMovementRecord[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');

  constructor(private stockMovementService: StockMovementService) {}

  ngOnInit(): void {
    this.stockMovementService.getAllMovements().subscribe({
      next: (data) => {
        // Sort newest first, so the most recent activity is always 
        // at the top - easier to scan than chronological order
        const sorted = [...data].sort((a, b) => b.id - a.id);
        this.movements.set(sorted);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set('Status: ' + err.status);
      }
    });
  }

  // Returns a Tailwind color class based on movement type, so IN 
  // (positive) and DISPENSED/DAMAGE/EXPIRED (negative) are visually 
  // distinct at a glance, without reading every row's text
  getTypeColor(type: string): string {
    if (type === 'IN') return 'bg-green-100 text-green-700';
    if (type === 'ADJUSTMENT') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  }
}
