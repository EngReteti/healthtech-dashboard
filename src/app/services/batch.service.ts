import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Batch {
  id: number;
  batchNumber: string;
  expiryDate: string;
  receivedDate: string;
  product: { id: number; name: string; sku: string };
}

export interface CreateBatchRequest {
  product: { id: number };
  batchNumber: string;
  expiryDate: string;
  receivedDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  private apiUrl = 'http://localhost:8080/api/stock-batches';

  constructor(private http: HttpClient) {}

  getAllBatches(): Observable<Batch[]> {
    return this.http.get<Batch[]>(this.apiUrl);
  }

  createBatch(batch: CreateBatchRequest): Observable<Batch> {
    return this.http.post<Batch>(this.apiUrl, batch);
  }
}
