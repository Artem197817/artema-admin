import { Component, OnInit } from '@angular/core';
import { Customer } from '../../types/customer.type';
import { Order, OrderPayment, OrderStatus } from '../../types/order.type';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { PaymentService } from '../../services/payment.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {

  protected paymentForm: FormGroup;

  protected customer: Customer | null = null;
  protected order: Order | null = null;
  protected payment: OrderPayment | null = null;
  protected orderStatusHistoryShort: OrderStatus[] = [];
  protected isHistoryActive: boolean = false;
  protected isAddPaymentBlockActive: boolean = false;
  protected isHistoryPaymentActive: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private customerService: CustomerService,
    private paymentService: PaymentService,
    private fb: FormBuilder) {

    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required]],
      comment: [''],

    });
  }

  public ngOnInit() {
    this.activatedRoute.params
      .subscribe(params => {
        this.orderService.getOrderById(params['orderId'])
          .subscribe((data: Order) => {

            this.order = data;
            console.log(this.order)
            if (this.order && this.order.customerId) {
              this.customerService.getCustomerById(this.order.customerId)
                .subscribe((customer: Customer) => {
                  this.customer = customer;
                })
            }
            if (this.order && this.order.orderId) {
              this.paymentService.getPaymentByOrderId(this.order.orderId)
                .subscribe((payment: OrderPayment) => {
                  this.payment = payment;
                  console.log(this.payment);
                })
            }

          })
        if (this.order && this.order.orderHistoryList) {
          if (this.order.orderHistoryList.length <= 3) {
            this.orderStatusHistoryShort = this.order.orderHistoryList;
          } else {
            this.orderStatusHistoryShort = this.order.orderHistoryList.slice(-3);
          }
        }
      })
  }

  protected changeIsHistoryActive() {
    this.isHistoryActive = !this.isHistoryActive;
  }

  protected changeIsAddPaymentBlockActive() {
    this.isAddPaymentBlockActive = !this.isAddPaymentBlockActive;
  }

  protected changeIsHistoryPaymentActive() {
    this.isHistoryPaymentActive = !this.isHistoryPaymentActive;
  }
  protected addPayment(orderId: number) {
    if (this.paymentForm.valid) {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const formattedDate = `${day}.${month}.${year}`;
      const comment = this.paymentForm.get('comment')? this.paymentForm.get('comment')?.value : '';
      let payment = {
        payment: this.paymentForm.get('amount')?.value,
        paymentDate: formattedDate,
        comment: comment,
        orderId: this.order?.orderId,
      }
      this.paymentService.savePayment(payment)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.paymentForm.reset();
          this.changeIsAddPaymentBlockActive();
        },
        error: (error) => {
          console.error('Ошибка при сохранении платежа', error);
        }
      });
    }
  }
}
