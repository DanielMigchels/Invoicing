import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedList } from '../paginated-list';
import { InvoiceResponseModel } from './models/invoice-response-model';
import { CreateInvoiceRequestModel } from './models/create-invoice-request-model';
import { UpdateInvoiceRequestModel } from './models/update-invoice-request-model';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private apiUrl = '/api/invoice';
  private http = inject(HttpClient);

  getAll(page = 1, pageSize = 25): Observable<PaginatedList<InvoiceResponseModel>> {
    return this.http.get<PaginatedList<InvoiceResponseModel>>(this.apiUrl, {
      params: { page, pageSize },
    });
  }

  getById(id: string): Observable<InvoiceResponseModel> {
    return this.http.get<InvoiceResponseModel>(`${this.apiUrl}/${id}`);
  }

  create(model: CreateInvoiceRequestModel): Observable<InvoiceResponseModel> {
    return this.http.post<InvoiceResponseModel>(this.apiUrl, model);
  }

  update(id: string, model: UpdateInvoiceRequestModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, model);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
