import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../types/customer.type';
import {SimpleResponseType} from '../types/simpleResponse.type';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private url = environment.api + 'customer';

  constructor(private http: HttpClient) { }

  public getCustomerById(customerId: number): Observable<Customer>{
    return this.http.get<Customer>(this.url +`/${customerId}`);
  }

  public getCustomers (): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.url + '/');
  }
  public deleteCustomer(customerId: number): Observable<SimpleResponseType> {
    return this.http.delete<SimpleResponseType>(this.url +`/delete_customer/${customerId}`);
  }

  getCustomersByStatuses(statuses: string[]): Observable<Customer[]> {
    return this.http.post<Customer[]>(`${this.url}/filter-by-statuses`, statuses);
  }
}
