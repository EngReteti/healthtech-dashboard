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
}
