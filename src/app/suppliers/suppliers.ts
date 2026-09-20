import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierService, Supplier } from '../services/supplier.service';
import { toFriendlyMessage } from '../utils/http-error.util';

@Component({
  selector: 'app-suppliers',
  imports: [CommonModule, FormsModule],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.css'
})
export class Suppliers implements OnInit {

  suppliers = signal<Supplier[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  submitting = signal<boolean>(false);

  // Controls whether the "Add Supplier" form is currently shown - 
  // keeps the page clean until someone actually wants to add one
  showForm = signal<boolean>(false);

  // Form field values
  name: string = '';
  phone: string = '';
  email: string = '';
  address: string = '';

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading.set(true);
    this.supplierService.getAllSuppliers().subscribe({
      next: (data) => {
        this.suppliers.set(data);
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
    this.submitting.set(true);

    this.supplierService.createSupplier({
      name: this.name,
      phone: this.phone,
      email: this.email,
      address: this.address
    }).subscribe({
      next: (newSupplier) => {
        this.submitting.set(false);
        this.successMessage.set(`${newSupplier.name} added successfully.`);
        // Add it straight to the visible list, no need to re-fetch everything
        this.suppliers.update((current) => [...current, newSupplier]);
        // Reset the form
        this.name = '';
        this.phone = '';
        this.email = '';
        this.address = '';
        this.showForm.set(false);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }
}
