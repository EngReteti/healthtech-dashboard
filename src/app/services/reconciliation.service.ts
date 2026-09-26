import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReconciliationResult {
  calculatedStock: number;
  countedQuantity: number;
  variance: number;
  discrepancyFound: boolean;
  pendingAdjustment: any;
}

@Injectable({
  providedIn: 'root'
})
export class ReconciliationService {

  private apiUrl = 'http://localhost:8080/api/reconciliation';

  constructor(private http: HttpClient) {}

  reconcile(productId: number, countedQuantity: number): Observable<ReconciliationResult> {
    return this.http.post<ReconciliationResult>(this.apiUrl, { productId, countedQuantity });
  }
}
