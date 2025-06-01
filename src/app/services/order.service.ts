import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {StatusRequest} from '../types/status.types';
import {Observable} from 'rxjs';
import {OrderMini} from '../types/order-mini.type';
import { Order } from '../types/order.type';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private url = environment.api + 'order';
  constructor(private http: HttpClient) { }

  public findOrdersByStatus(status: StatusRequest): Observable<OrderMini[]> {
    return this.http.get<OrderMini[]>(this.url +`/status/${status}`);
  }

  public getOrderById(orderId: number): Observable<Order>{
    return this.http.get<Order>(this.url +`/${orderId}`);
  }

  public getOrdersAll(): Observable<Order>{
    return this.http.get<Order>(this.url +`/`);
  }
}
