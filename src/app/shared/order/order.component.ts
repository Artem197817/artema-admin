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
import {TruncateTextPipe} from '../../utils/truncate-text.pipe';
import {firstValueFrom} from 'rxjs';
declare const window: any;

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TruncateTextPipe,
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
      
            if (this.order && this.order.orderStatusHistory) {
              if (this.order.orderStatusHistory.length <= 3) {
                this.orderStatusHistoryShort = this.order.orderStatusHistory;
              } else {
                this.orderStatusHistoryShort = this.order.orderStatusHistory.slice(-3);
              }
            }

            if (this.order && this.order.customerId) {
              this.customerService.getCustomerById(this.order.customerId)
                .subscribe((customer: Customer) => {
                  this.customer = customer;
                })
            }
         this.loadPayment();
          })
      })
  }

  private loadPayment (){
    if (this.order && this.order.orderId) {
      this.paymentService.getPaymentByOrderId(this.order.orderId)
        .subscribe((payment: OrderPayment) => {
          this.payment = payment;
        })
    }
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
  protected addPayment(orderId: number | undefined) {
    if (this.paymentForm.valid && orderId) {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const formattedDate = `${day}.${month}.${year}`;
      const comment = this.paymentForm.get('comment')? this.paymentForm.get('comment')?.value : '';
      let payment = {
        payment: this.paymentForm.get('amount')?.value,
        paymentData: formattedDate,
        comment: comment,
        orderId: this.order?.orderId,
      }
      this.paymentService.savePayment(payment)
      .subscribe({
        next: (response) => {
          this.paymentForm.reset();
          this.changeIsAddPaymentBlockActive();
          this.loadPayment();
        },
        error: (error) => {
          console.error('Ошибка при сохранении платежа', error);
        }
      });
    }
  }

  async downloadFile(fileId: number, fileName: string) {
    try {
      const blob = await firstValueFrom(this.orderService.downloadFile(fileId));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при скачивании файла', error);
    }
  }
  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return 'fa-file-image'; // иконка картинки
      case 'pdf':
        return 'fa-file-pdf';
      case 'doc':
      case 'docx':
        return 'fa-file-word';
      case 'xls':
      case 'xlsx':
        return 'fa-file-excel';
      case 'zip':
      case 'rar':
        return 'fa-file-archive';
      case 'txt':
        return 'fa-file-alt';
      case 'psd':
        return 'fa-file-image';
      case 'fig':
        return 'fa-file';
      default:
        return 'fa-file';
    }
  }

}
