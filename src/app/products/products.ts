import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../services/product.service';
import { SupplierService, Supplier } from '../services/supplier.service';
import { toFriendlyMessage } from '../utils/http-error.util';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {

  products = signal<Product[]>([]);
  suppliers = signal<Supplier[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  submitting = signal<boolean>(false);
  showForm = signal<boolean>(false);

  // Form field values
  name: string = '';
  sku: string = '';
  category: string = 'MEDICATION';
  unitPrice: number = 0;
  reorderLevel: number = 10;
  isControlledSubstance: boolean = false;
  selectedSupplierId: number | null = null;

  constructor(
    private productService: ProductService,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    // We need the supplier list too, so the form's dropdown has 
    // real options to pick from
    this.supplierService.getAllSuppliers().subscribe({
      next: (data) => this.suppliers.set(data)
    });
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.selectedSupplierId) {
      this.errorMessage.set('Please select a supplier.');
      return;
    }

    this.submitting.set(true);

    this.productService.createProduct({
      name: this.name,
      sku: this.sku,
      category: this.category,
      unitPrice: this.unitPrice,
      reorderLevel: this.reorderLevel,
      isControlledSubstance: this.isControlledSubstance,
      supplier: { id: this.selectedSupplierId }
    }).subscribe({
      next: (newProduct) => {
        this.submitting.set(false);
        this.successMessage.set(`${newProduct.name} added successfully.`);
        this.products.update((current) => [...current, newProduct]);

        // Reset the form
        this.name = '';
        this.sku = '';
        this.category = 'MEDICATION';
        this.unitPrice = 0;
        this.reorderLevel = 10;
        this.isControlledSubstance = false;
        this.selectedSupplierId = null;
        this.showForm.set(false);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }
}
