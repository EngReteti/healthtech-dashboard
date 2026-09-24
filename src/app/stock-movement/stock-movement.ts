import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../services/product.service';
import { UserService } from '../services/user.service';
import { DepartmentService, Department } from '../services/department.service';
import { BatchService, Batch } from '../services/batch.service';
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
  allBatches = signal<Batch[]>([]);
  movementTypes = ['IN', 'DISPENSED', 'TRANSFER', 'DAMAGE', 'EXPIRED', 'ADJUSTMENT'];

  selectedProductId: number | null = null;
  selectedType: string = 'IN';
  selectedDepartmentId: number | null = null;
  selectedBatchId: number | null = null;
  quantity: number = 1;
  reason: string = '';
  currentUserId: number | null = null;

  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  submitting = signal<boolean>(false);

  // computed() automatically recalculates whenever selectedProductId 
  // or allBatches changes - this is what filters the batch dropdown 
  // to only show batches belonging to the currently selected product
  batchesForSelectedProduct = computed(() => {
    const productId = this.selectedProductId;
    if (!productId) return [];
    return this.allBatches().filter(b => b.product.id === productId);
  });

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private departmentService: DepartmentService,
    private batchService: BatchService,
    private stockMovementService: StockMovementService
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.products.set(data)
    });

    this.departmentService.getAllDepartments().subscribe({
      next: (data) => this.departments.set(data)
    });

    this.batchService.getAllBatches().subscribe({
      next: (data) => this.allBatches.set(data)
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

    if (this.selectedType === 'TRANSFER' && !this.selectedDepartmentId) {
      this.errorMessage.set('Please select a destination department for this transfer.');
      return;
    }

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

    if (this.selectedType === 'TRANSFER' && this.selectedDepartmentId) {
      payload.department = { id: this.selectedDepartmentId };
    }

    // Batch is optional and only relevant for IN - not every delivery 
    // needs to reference a pre-existing batch (e.g. equipment doesn't 
    // track batches at all)
    if (this.selectedType === 'IN' && this.selectedBatchId) {
      payload.batch = { id: this.selectedBatchId };
    }

    this.stockMovementService.recordMovement(payload).subscribe({
      next: (response) => {
        this.submitting.set(false);
        this.successMessage.set(`Movement recorded successfully. Status: ${response.status}`);
        this.quantity = 1;
        this.reason = '';
        this.selectedDepartmentId = null;
        this.selectedBatchId = null;
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }
}
