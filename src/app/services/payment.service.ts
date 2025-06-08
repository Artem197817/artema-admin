import { Injectable } from '@angular/core';
import { OrderPayment, Payment } from '../types/order.type';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private url = environment.api + 'payment';
  constructor(private http: HttpClient) { }


  public getPaymentByOrderId(orderId: number): Observable<OrderPayment>{
    return this.http.get<OrderPayment>(this.url +`/${orderId}`);
  }

  public savePayment(payment: Payment) {
    return this.http.post(this.url + '/save_payment', payment, { responseType: 'text'});
  }
}
