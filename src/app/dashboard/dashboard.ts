import { Component, OnInit, signal } from '@angular/core';
import { ProductService, Product } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');

  // A simple lookup: product ID -> its current stock number.
  // We use a plain object here since it's just local, temporary data 
  // used only for display, not something Angular needs to reactively 
  // track field-by-field the way our main signals do
  stockLevels = signal<{ [productId: number]: number }>({});

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);

        // For each product, separately fetch its real current stock 
        // and add it to our stockLevels signal once it arrives
        data.forEach((product) => {
          this.productService.getCurrentStock(product.id).subscribe({
            next: (stock) => {
              this.stockLevels.update((current) => ({
                ...current,
                [product.id]: stock
              }));
            }
          });
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set('Status: ' + err.status);
      }
    });
  }
}
