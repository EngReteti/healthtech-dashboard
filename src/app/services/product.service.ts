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

export interface CreateProductRequest {
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  reorderLevel: number;
  isControlledSubstance: boolean;
  supplier: { id: number };
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

  getCurrentStock(productId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${productId}/stock`);
  }

  createProduct(product: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }
}
