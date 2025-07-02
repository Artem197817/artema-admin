import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Status } from '../../types/status.types';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {OrderCardComponent} from '../components/order-card/order-card.component';
import {Order} from '../../types/order.type';
import {OrderMini} from '../../types/order-mini.type';
import {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    OrderCardComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  statusList = Object.values(Status).filter(s => s !== Status.NONE); // Исключим NONE
  form: FormGroup;
  protected isFilterBlockActive: boolean = false;
  protected searchQuery: string = '';
  protected orders: OrderMini[] = [];
  private selectedStatuses: string[] = [];

  @Output() filterChanged = new EventEmitter<string[]>(); // Массив статусов на русском

  constructor(private fb: FormBuilder,
              private orderService: OrderService,) {
    this.form = this.fb.group({
      statuses: this.fb.array(this.statusList.map(() => false))
    });
  }

  get statusesArray() {
    return this.form.get('statuses') as FormArray;
  }

  onSubmit() {
    // Собираем выбранные статусы
    const selectedStatuses = this.statusesArray.value
      .map((checked: boolean, i: number) => checked ? this.statusList[i] : null)
      .filter((v: string | null) => v !== null);

    this.filterChanged.emit(selectedStatuses as string[]);
  }

ngOnInit(): void {
  this.getOrders();
}

protected getOrders(): void {
  this.orderService.getOrdersAll().subscribe((orders: OrderMini[]) => {
    this.orders = orders;
  })
}

protected changeIsFilterBlockActive(){
  this.isFilterBlockActive = !this.isFilterBlockActive;
}

protected filterReset(){
    this.getOrders();
}

protected ordersSearch(){}


  onStatusChange(status: string, $event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedStatuses.push(status);
    } else {
      this.selectedStatuses = this.selectedStatuses.filter(s => s !== status);
    }

  }

  applyFilter() {
    this.orderService.filterOrdersByStatuses(this.selectedStatuses)
      .subscribe((orders: OrderMini[]) => {
        this.orders = orders;
        this.changeIsFilterBlockActive()
      })
  }

}
