import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {StatusRequest} from '../types/status.types';
import {Observable} from 'rxjs';
import {OrderMini} from '../types/order-mini.type';
import { Order } from '../types/order.type';
import {SimpleResponseType} from '../types/simpleResponse.type';

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

  downloadFile(fileId: number): Observable<Blob> {
    return this.http.get(`${this.url}/files/${fileId}`, { responseType: 'blob' });
  }
  public getOrdersByCustomerId(customerId: number): Observable<OrderMini[]> {
    return this.http.get<OrderMini[]>(this.url +`/orders_customer/${customerId}`);
  }

  public deleteOrder(orderId: number): Observable<SimpleResponseType> {
    return this.http.delete<SimpleResponseType>(this.url +`/delete_order/${orderId}`);
  }

  public createOrder(formData: FormData): Observable<any> {
    return this.http.post(this.url, formData);
  }
}
