import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../services/product.service';
import { UserService } from '../services/user.service';
import { StockMovementService } from '../services/stock-movement.service';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-stock-movement',
  imports: [FormsModule, CommonModule, Navbar],
  templateUrl: './stock-movement.html',
  styleUrl: './stock-movement.css'
})
export class StockMovement implements OnInit {

  // The full product list, used to populate the dropdown
  products = signal<Product[]>([]);

  // The five real movement types our backend accepts, matching 
  // MovementType.java exactly - used to populate the second dropdown
  movementTypes = ['IN', 'DISPENSED', 'TRANSFER', 'DAMAGE', 'EXPIRED', 'ADJUSTMENT'];

  // Form field values - what the user is currently typing/selecting
  selectedProductId: number | null = null;
  selectedType: string = 'IN';
  quantity: number = 1;
  reason: string = '';

  // The logged-in user's own numeric id, fetched once when this page 
  // loads - needed to fill in "performedBy" when submitting
  currentUserId: number | null = null;

  // Feedback shown to the user after submitting
  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  submitting = signal<boolean>(false);

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private stockMovementService: StockMovementService
  ) {}

  ngOnInit(): void {
    // Load the product list for the dropdown
    this.productService.getAllProducts().subscribe({
      next: (data) => this.products.set(data)
    });

    // Learn who's currently logged in, so we know their real user id
    this.userService.getCurrentUser().subscribe({
      next: (user) => this.currentUserId = user.id
    });
  }

  onSubmit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    // Basic safety check before even sending the request - if we don't 
    // know who the user is yet, or no product is selected, stop here
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
        this.successMessage.set(
          `Movement recorded successfully. Status: ${response.status}`
        );
        // Reset the form for the next entry
        this.quantity = 1;
        this.reason = '';
      },
      error: (err) => {
        this.submitting.set(false);
        // Our backend's GlobalExceptionHandler sends back a clean 
        // { "error": "..." } message - we display that real message 
        // directly, e.g. "Cannot record movement: only 100 available..."
        this.errorMessage.set(err.error?.error || 'Something went wrong. Please try again.');
      }
    });
  }
}
