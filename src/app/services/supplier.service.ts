import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Supplier {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private apiUrl = 'http://localhost:8080/api/suppliers';

  constructor(private http: HttpClient) {}

  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  createSupplier(supplier: Omit<Supplier, 'id'>): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier);
  }
}
