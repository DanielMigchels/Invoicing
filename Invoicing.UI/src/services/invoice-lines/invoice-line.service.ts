import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedList } from '../paginated-list';
import { InvoiceLineResponseModel } from './models/invoice-line-response-model';
import { CreateInvoiceLineRequestModel } from './models/create-invoice-line-request-model';
import { UpdateInvoiceLineRequestModel } from './models/update-invoice-line-request-model';

@Injectable({ providedIn: 'root' })
export class InvoiceLineService {
  private http = inject(HttpClient);

  private apiUrl(invoiceId: string): string {
    return `/api/invoice/${invoiceId}/invoiceline`;
  }

  getAll(invoiceId: string, page = 1, pageSize = 25): Observable<PaginatedList<InvoiceLineResponseModel>> {
    return this.http.get<PaginatedList<InvoiceLineResponseModel>>(this.apiUrl(invoiceId), {
      params: { page, pageSize },
    });
  }

  getById(invoiceId: string, id: string): Observable<InvoiceLineResponseModel> {
    return this.http.get<InvoiceLineResponseModel>(`${this.apiUrl(invoiceId)}/${id}`);
  }

  create(invoiceId: string, model: CreateInvoiceLineRequestModel): Observable<InvoiceLineResponseModel> {
    return this.http.post<InvoiceLineResponseModel>(this.apiUrl(invoiceId), model);
  }

  update(invoiceId: string, id: string, model: UpdateInvoiceLineRequestModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl(invoiceId)}/${id}`, model);
  }

  delete(invoiceId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl(invoiceId)}/${id}`);
  }
}
