import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StockMovementRequest {
  product: { id: number };
  type: string;
  quantity: number;
  reason: string;
  performedBy: { id: number };
}

// Matches the FULL shape of what our backend actually returns for 
// each movement - including the nested product and performedBy 
// objects, since we now need to DISPLAY this data, not just send it
export interface StockMovementRecord {
  id: number;
  type: string;
  quantity: number;
  reason: string;
  status: string;
  createdAt: string;
  product: { id: number; name: string; sku: string };
  performedBy: { id: number; name: string };
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

  // Fetches every movement ever recorded, for the History page
  getAllMovements(): Observable<StockMovementRecord[]> {
    return this.http.get<StockMovementRecord[]>(this.apiUrl);
  }
}
