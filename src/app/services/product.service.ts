import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// This matches the shape of data our backend's Product entity sends back -
// TypeScript uses this to catch mistakes early, e.g. if we typo a field name
export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  reorderLevel: number;
  isControlledSubstance: boolean;
  supplier: { id: number; name: string };
}

// @Injectable means: "this class can be automatically provided anywhere
// it's needed" - same dependency injection pattern as everything else
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  // Observable<Product[]> means: "this will eventually deliver a list
  // of products" - the actual delivery happens later, when something
  // calls .subscribe() on it, same pattern as login.ts
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
