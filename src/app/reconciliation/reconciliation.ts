import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../services/product.service';
import { ReconciliationService, ReconciliationResult } from '../services/reconciliation.service';
import { toFriendlyMessage } from '../utils/http-error.util';

@Component({
  selector: 'app-reconciliation',
  imports: [CommonModule, FormsModule],
  templateUrl: './reconciliation.html',
  styleUrl: './reconciliation.css'
})
export class Reconciliation implements OnInit {

  products = signal<Product[]>([]);
  selectedProductId: number | null = null;
  countedQuantity: number = 0;

  result = signal<ReconciliationResult | null>(null);
  errorMessage = signal<string>('');
  submitting = signal<boolean>(false);

  constructor(
    private productService: ProductService,
    private reconciliationService: ReconciliationService
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.products.set(data)
    });
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.result.set(null);

    if (!this.selectedProductId) {
      this.errorMessage.set('Please select a product to count.');
      return;
    }

    this.submitting.set(true);

    this.reconciliationService.reconcile(this.selectedProductId, this.countedQuantity).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.result.set(res);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }

  reset(): void {
    this.result.set(null);
    this.selectedProductId = null;
    this.countedQuantity = 0;
  }
}
