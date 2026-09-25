import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockMovementRecord } from './stock-movement.service';

export interface AnomalyResult {
  movement: StockMovementRecord;
  reason: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnomalyService {

  private apiUrl = 'http://localhost:8080/api/anomalies';

  constructor(private http: HttpClient) {}

  getAnomalies(): Observable<AnomalyResult[]> {
    return this.http.get<AnomalyResult[]>(this.apiUrl);
  }
}
