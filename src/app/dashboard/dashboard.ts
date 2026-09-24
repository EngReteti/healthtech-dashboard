import { Component, OnInit, signal } from '@angular/core';
import { ProductService, Product } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { toFriendlyMessage } from '../utils/http-error.util';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');
  stockLevels = signal<{ [productId: number]: number }>({});

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);

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
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }

  // Compares real current stock against that product's own reorder 
  // level - "at or below" counts as critical (red), within 50% 
  // above it counts as getting close (yellow), otherwise healthy
  getStockColor(product: Product): string {
    const stock = this.stockLevels()[product.id];
    if (stock === undefined) return 'text-gray-700';

    if (stock <= product.reorderLevel) return 'text-red-600';
    if (stock <= product.reorderLevel * 1.5) return 'text-yellow-600';
    return 'text-green-600';
  }

  // Only shows a warning badge when stock has actually reached the 
  // reorder point - this is the real "alert," not just colored text
  isLowStock(product: Product): boolean {
    const stock = this.stockLevels()[product.id];
    return stock !== undefined && stock <= product.reorderLevel;
  }
}
