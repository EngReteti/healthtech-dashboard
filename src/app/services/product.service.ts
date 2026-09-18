import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currency: string;
  reorderLevel: number;
  isControlledSubstance: boolean;
  supplier: { id: number; name: string };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Fetches the real, calculated current stock for one product -
  // returns a plain number, matching exactly what our backend
  // endpoint sends back
  getCurrentStock(productId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${productId}/stock`);
  }
}
