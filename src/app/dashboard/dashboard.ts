import { Component, OnInit, signal } from '@angular/core';
import { ProductService, Product } from '../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  // signal() creates a value that Angular actively tracks - when it 
  // changes, the screen is GUARANTEED to update, unlike a plain 
  // variable which may not trigger a refresh in newer Angular versions
  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set('Status: ' + err.status);
      }
    });
  }
}
