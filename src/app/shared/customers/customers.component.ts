import {Component, OnInit} from '@angular/core';
import { Customer } from '../../types/customer.type';
import { RouterModule } from '@angular/router';
import {OrderService} from '../../services/order.service';
import {CustomerService} from '../../services/customer.service';
import {TruncateTextPipe} from '../../utils/truncate-text.pipe';
import {Order} from '../../types/order.type';
import {OrderMini} from '../../types/order-mini.type';
import {PopupConfirmComponent} from '../components/popup-confirm/popup-confirm.component';
import {Status} from '../../types/status.types';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    RouterModule,
    TruncateTextPipe,
    PopupConfirmComponent,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {

  protected customers: Customer[] = [];
  protected orders: OrderMini[] = [];
  protected isOrderBlockActive: boolean = false;
  protected isPopupVisible: boolean = false;
  private customerId: number | null = null;
  statuses = Object.values(Status).filter(s => s !== Status.NONE);
  selectedStatuses: string[] = [];
  protected isFilterOrderStatusActive: boolean = false;
  protected isOrderNoActive: boolean = false;

  constructor(private orderService: OrderService,
              private customerService: CustomerService,) {}

  ngOnInit(): void {
    this.getCustomers()
  }

 private getCustomers(): void {
    this.customerService.getCustomers().subscribe(
      customers => {
        this.customers = customers;
      });
  }

  showOrders(customerId: number) {
    this.orderService.getOrdersByCustomerId(customerId).subscribe
    (
      (orders: OrderMini[]) => {
        if (orders && orders.length > 0) {
          this.orders = orders;
        }
        this.isOrderBlockActiveChange();
      }
    )
  }
  protected isOrderBlockActiveChange(){
    this.isOrderBlockActive = !this.isOrderBlockActive;
  }

  showDeletePopup(id: number) {
    this.customerId = id;
    this.isPopupVisible = true;
  }

  onConfirmDelete() {
    if (this.customerId !== null) {
      this.customerService.deleteCustomer(this.customerId).subscribe(() => {
       this.getCustomers();
      });
    }
    this.isPopupVisible = false;
    this.customerId = null;
  }

  onCancelDelete() {
    this.isPopupVisible = false;
    this.customerId = null;
  }

  onStatusChange(status: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedStatuses.push(status);
    } else {
      this.selectedStatuses = this.selectedStatuses.filter(s => s !== status);
    }
  }

  isFilterOrderStatusActiveChange() {
    this.isFilterOrderStatusActive = !this.isFilterOrderStatusActive;
  }

  applyFilter() {

  }
}
