import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedList } from '../paginated-list';
import { CustomerResponseModel } from './models/customer-response-model';
import { CreateCustomerRequestModel } from './models/create-customer-request-model';
import { UpdateCustomerRequestModel } from './models/update-customer-request-model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = '/api/customer';
  private http = inject(HttpClient);

  getAll(page = 1, pageSize = 25): Observable<PaginatedList<CustomerResponseModel>> {
    return this.http.get<PaginatedList<CustomerResponseModel>>(this.apiUrl, {
      params: { page, pageSize },
    });
  }

  getById(id: string): Observable<CustomerResponseModel> {
    return this.http.get<CustomerResponseModel>(`${this.apiUrl}/${id}`);
  }

  create(model: CreateCustomerRequestModel): Observable<CustomerResponseModel> {
    return this.http.post<CustomerResponseModel>(this.apiUrl, model);
  }

  update(id: string, model: UpdateCustomerRequestModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, model);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
