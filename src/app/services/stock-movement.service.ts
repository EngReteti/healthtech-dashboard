import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Matches exactly what our backend's StockMovementController expects - 
// note "product" and "performedBy" are sent as small objects containing 
// just an id, matching the @ManyToOne relationships on the backend
export interface StockMovementRequest {
  product: { id: number };
  type: string;
  quantity: number;
  reason: string;
  performedBy: { id: number };
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
}
