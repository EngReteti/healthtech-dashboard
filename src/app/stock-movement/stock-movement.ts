import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../services/product.service';
import { UserService } from '../services/user.service';
import { DepartmentService, Department } from '../services/department.service';
import { StockMovementService } from '../services/stock-movement.service';
import { toFriendlyMessage } from '../utils/http-error.util';

@Component({
  selector: 'app-stock-movement',
  imports: [FormsModule, CommonModule],
  templateUrl: './stock-movement.html',
  styleUrl: './stock-movement.css'
})
export class StockMovement implements OnInit {

  products = signal<Product[]>([]);
  departments = signal<Department[]>([]);
  movementTypes = ['IN', 'DISPENSED', 'TRANSFER', 'DAMAGE', 'EXPIRED', 'ADJUSTMENT'];

  selectedProductId: number | null = null;
  selectedType: string = 'IN';
  selectedDepartmentId: number | null = null;
  quantity: number = 1;
  reason: string = '';
  currentUserId: number | null = null;

  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  submitting = signal<boolean>(false);

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private departmentService: DepartmentService,
    private stockMovementService: StockMovementService
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.products.set(data)
    });

    this.departmentService.getAllDepartments().subscribe({
      next: (data) => this.departments.set(data)
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

    // TRANSFER specifically requires a destination department - every 
    // other movement type leaves this optional/unset
    if (this.selectedType === 'TRANSFER' && !this.selectedDepartmentId) {
      this.errorMessage.set('Please select a destination department for this transfer.');
      return;
    }
   
   // trim() removes leading/trailing spaces, so a reason of just 
    // " " (a lone space) is correctly treated as empty too, not 
    // accepted as if it were real text
    if (!this.reason || this.reason.trim().length === 0) {
      this.errorMessage.set('Please provide a reason for this movement.');
      return;
    }

    this.submitting.set(true);

    const payload: any = {
      product: { id: this.selectedProductId },
      type: this.selectedType,
      quantity: this.quantity,
      reason: this.reason,
      performedBy: { id: this.currentUserId }
    };

    // Only attach a department when it's actually relevant - keeps 
    // the request clean for every other movement type
    if (this.selectedType === 'TRANSFER' && this.selectedDepartmentId) {
      payload.department = { id: this.selectedDepartmentId };
    }

    this.stockMovementService.recordMovement(payload).subscribe({
      next: (response) => {
        this.submitting.set(false);
        this.successMessage.set(`Movement recorded successfully. Status: ${response.status}`);
        this.quantity = 1;
        this.reason = '';
        this.selectedDepartmentId = null;
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }
}
