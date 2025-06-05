import { Component, OnInit } from '@angular/core';
import { Customer } from '../../types/customer.type';
import { Order, OrderPayment } from '../../types/order.type';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { PaymentService } from '../../services/payment.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-order',
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.scss'
})
export class CreateOrderComponent implements OnInit {
  protected createOrderForm: FormGroup;
  orderId: string | null = null;
  protected customer: Customer | null = null;
  protected order: Order | null = null;
  protected payment: OrderPayment | null = null;

  constructor(private activatedRoute: ActivatedRoute,
              private orderService: OrderService,
              private customerService: CustomerService,
              private paymentService: PaymentService,
              private fb: FormBuilder,){

                const phonePattern = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;

                this.createOrderForm = this.fb.group({
                  customer: {
                    name: ['', [Validators.required]],
                    lastName: [''],
                    fatherName: [''],
                    phone: ['', [Validators.required, Validators.pattern(phonePattern)]],
                     email: ['', [Validators.required,Validators.email]],
                    comment: [''],
                  }

                
            
                });
              }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.orderId = params.get('orderId');
      if (this.orderId) {
        // Режим редактирования: загрузить данные заказа
        this.loadOrder(this.orderId);
      } else {
        // Режим создания: очистить форму
        this.order = null;
      }
    });
}
loadOrder(orderId: string){
  this.orderService.getOrderById(+orderId)
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
        })
    }

  })
}
}
