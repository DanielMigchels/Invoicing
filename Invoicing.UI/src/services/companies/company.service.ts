import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedList } from '../paginated-list';
import { CompanyResponseModel } from './models/company-response-model';
import { CreateCompanyRequestModel } from './models/create-company-request-model';
import { UpdateCompanyRequestModel } from './models/update-company-request-model';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private apiUrl = '/api/company';
  private http = inject(HttpClient);

  getAll(page = 1, pageSize = 25): Observable<PaginatedList<CompanyResponseModel>> {
    return this.http.get<PaginatedList<CompanyResponseModel>>(this.apiUrl, {
      params: { page, pageSize },
    });
  }

  getById(id: string): Observable<CompanyResponseModel> {
    return this.http.get<CompanyResponseModel>(`${this.apiUrl}/${id}`);
  }

  create(model: CreateCompanyRequestModel): Observable<CompanyResponseModel> {
    return this.http.post<CompanyResponseModel>(this.apiUrl, model);
  }

  update(id: string, model: UpdateCompanyRequestModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, model);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
