import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../services/product.service';
import { UserService } from '../services/user.service';
import { StockMovementService } from '../services/stock-movement.service';

@Component({
  selector: 'app-stock-movement',
  imports: [FormsModule, CommonModule],
  templateUrl: './stock-movement.html',
  styleUrl: './stock-movement.css'
})
export class StockMovement implements OnInit {

  products = signal<Product[]>([]);
  movementTypes = ['IN', 'DISPENSED', 'TRANSFER', 'DAMAGE', 'EXPIRED', 'ADJUSTMENT'];

  selectedProductId: number | null = null;
  selectedType: string = 'IN';
  quantity: number = 1;
  reason: string = '';
  currentUserId: number | null = null;

  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  submitting = signal<boolean>(false);

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private stockMovementService: StockMovementService
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.products.set(data)
    });

    this.userService.getCurrentUser().subscribe({
      next: (user) => this.currentUserId = user.id
    });
  }

  onSubmit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (!this.selectedProductId || !this.currentUserId) {
      this.errorMessage.set('Please select a product and wait for your account to load.');
      return;
    }

    this.submitting.set(true);

    this.stockMovementService.recordMovement({
      product: { id: this.selectedProductId },
      type: this.selectedType,
      quantity: this.quantity,
      reason: this.reason,
      performedBy: { id: this.currentUserId }
    }).subscribe({
      next: (response) => {
        this.submitting.set(false);
        this.successMessage.set(`Movement recorded successfully. Status: ${response.status}`);
        this.quantity = 1;
        this.reason = '';
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(err.error?.error || 'Something went wrong. Please try again.');
      }
    });
  }
}
