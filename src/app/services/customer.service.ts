import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../types/customer.type';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private url = environment.api + 'customer';

  constructor(private http: HttpClient) { }

  public getCustomerById(customerId: number): Observable<Customer>{
    return this.http.get<Customer>(this.url +`/${customerId}`);
  }
}
