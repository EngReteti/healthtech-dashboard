import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BatchService, Batch } from '../services/batch.service';
import { ProductService, Product } from '../services/product.service';
import { toFriendlyMessage } from '../utils/http-error.util';

@Component({
  selector: 'app-batches',
  imports: [CommonModule, FormsModule],
  templateUrl: './batches.html',
  styleUrl: './batches.css'
})
export class Batches implements OnInit {

  batches = signal<Batch[]>([]);
  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  submitting = signal<boolean>(false);
  showForm = signal<boolean>(false);

  selectedProductId: number | null = null;
  batchNumber: string = '';
  expiryDate: string = '';
  receivedDate: string = '';

  constructor(
    private batchService: BatchService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadBatches();

    this.productService.getAllProducts().subscribe({
      next: (data) => this.products.set(data)
    });
  }

  loadBatches(): void {
    this.loading.set(true);
    this.batchService.getAllBatches().subscribe({
      next: (data) => {
        // Sort so the SOONEST-expiring batch always appears first - 
        // the most urgent thing to know is naturally at the top
        const sorted = [...data].sort((a, b) =>
          new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
        );
        this.batches.set(sorted);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }

  // Calculates whole days remaining until a batch's expiry date, 
  // used both for display and for deciding the warning color
  daysUntilExpiry(expiryDate: string): number {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffMs = expiry.getTime() - today.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  // Returns a Tailwind color class based on urgency - already 
  // expired (red), expiring within 30 days (yellow), otherwise 
  // safely far out (green)
  getExpiryColor(expiryDate: string): string {
    const days = this.daysUntilExpiry(expiryDate);
    if (days < 0) return 'bg-red-100 text-red-700';
    if (days <= 30) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  }

  getExpiryLabel(expiryDate: string): string {
    const days = this.daysUntilExpiry(expiryDate);
    if (days < 0) return `Expired ${Math.abs(days)} days ago`;
    if (days === 0) return 'Expires today';
    return `${days} days left`;
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.selectedProductId) {
      this.errorMessage.set('Please select a product.');
      return;
    }

    this.submitting.set(true);

    this.batchService.createBatch({
      product: { id: this.selectedProductId },
      batchNumber: this.batchNumber,
      expiryDate: this.expiryDate,
      receivedDate: this.receivedDate
    }).subscribe({
      next: (newBatch) => {
        this.submitting.set(false);
        this.successMessage.set(`Batch ${newBatch.batchNumber} added successfully.`);
        this.batches.update((current) => [...current, newBatch]);
        this.selectedProductId = null;
        this.batchNumber = '';
        this.expiryDate = '';
        this.receivedDate = '';
        this.showForm.set(false);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }
}
