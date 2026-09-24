import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StockMovementRequest {
  product: { id: number };
  type: string;
  quantity: number;
  reason: string;
  performedBy: { id: number };
  department?: { id: number };
  batch?: { id: number };
}

export interface StockMovementRecord {
  id: number;
  type: string;
  quantity: number;
  reason: string;
  status: string;
  createdAt: string;
  product: { id: number; name: string; sku: string };
  performedBy: { id: number; name: string };
  department?: { id: number; name: string };
  batch?: { id: number; batchNumber: string };
}

@Injectable({
  providedIn: 'root'
})
export class StockMovementService {

  private apiUrl = 'http://localhost:8080/api/stock-movements';

  constructor(private http: HttpClient) {}

  recordMovement(movement: StockMovementRequest): Observable<any> {
    return this.http.post(this.apiUrl, movement);
  }

  getAllMovements(): Observable<StockMovementRecord[]> {
    return this.http.get<StockMovementRecord[]>(this.apiUrl);
  }

  getPendingMovements(): Observable<StockMovementRecord[]> {
    return this.http.get<StockMovementRecord[]>(`${this.apiUrl}/pending`);
  }

  approveMovement(id: number): Observable<StockMovementRecord> {
    return this.http.post<StockMovementRecord>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectMovement(id: number): Observable<StockMovementRecord> {
    return this.http.post<StockMovementRecord>(`${this.apiUrl}/${id}/reject`, {});
  }
}
