import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockMovementService, StockMovementRecord } from '../services/stock-movement.service';
import { toFriendlyMessage } from '../utils/http-error.util';

@Component({
  selector: 'app-approvals',
  imports: [CommonModule],
  templateUrl: './approvals.html',
  styleUrl: './approvals.css'
})
export class Approvals implements OnInit {

  pendingMovements = signal<StockMovementRecord[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');
  processingId = signal<number | null>(null);

  constructor(private stockMovementService: StockMovementService) {}

  ngOnInit(): void {
    this.loadPending();
  }

  loadPending(): void {
    this.loading.set(true);
    this.stockMovementService.getPendingMovements().subscribe({
      next: (data) => {
        this.pendingMovements.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }

  approve(id: number): void {
    this.errorMessage.set('');
    this.processingId.set(id);
    this.stockMovementService.approveMovement(id).subscribe({
      next: () => {
        this.pendingMovements.update((current) => current.filter(m => m.id !== id));
        this.processingId.set(null);
      },
      error: (err) => {
        this.processingId.set(null);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }

  reject(id: number): void {
    this.errorMessage.set('');
    this.processingId.set(id);
    this.stockMovementService.rejectMovement(id).subscribe({
      next: () => {
        this.pendingMovements.update((current) => current.filter(m => m.id !== id));
        this.processingId.set(null);
      },
      error: (err) => {
        this.processingId.set(null);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }
}
