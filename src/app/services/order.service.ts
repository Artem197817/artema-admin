import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {StatusRequest} from '../types/status.types';
import {Observable} from 'rxjs';
import {OrderDTOMini} from '../types/order-mini.type';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private url = environment.api + '/order';
  constructor(private http: HttpClient) { }

  private findOrdersByStatus(status: StatusRequest): Observable<OrderDTOMini[]> {
    return this.http.get<OrderDTOMini[]>(this.url +`/${status}`);
  }
}
