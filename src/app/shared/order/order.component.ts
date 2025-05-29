import { Component, OnInit } from '@angular/core';
import { Customer } from '../../types/customer.type';
import { Order, OrderPayment, OrderStatus, Payment } from '../../types/order.type';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { PaymentService } from '../../services/payment.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit{

  

  protected customer: Customer| null = null;
  protected order: Order | null = null;
  protected payment: OrderPayment | null = null;
  protected orderStatusHistoryShort: OrderStatus[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private customerService: CustomerService,
    private paymentService: PaymentService,){

  }

  public ngOnInit() {
    this.activatedRoute.params
      .subscribe(params => {
        this.orderService.getOrderById(params['orderId'])
          .subscribe((data: Order) => {
            this.order = data;
            if (this.order && this.order.customerId) {
              this.customerService.getCustomerById(this.order.customerId)
                .subscribe((customer: Customer) => {
                  this.customer = customer;
                })
            }
            if(this.order){
                this.paymentService.getPaymentByOrderId(this.order.id)
                .subscribe((payment: OrderPayment) => {
                  this.payment = payment;
                })
            }

          })
          if(this.order &&  this.order.orderHistoryList && this.order.orderHistoryList.length <= 3){
            this.orderStatusHistoryShort = this.order.orderHistoryList;
          }
      })
  }

}
