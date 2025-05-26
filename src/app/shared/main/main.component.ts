import {Component, OnInit} from '@angular/core';
import {OrderMini} from '../../types/order-mini.type';
import {OrderService} from '../../services/order.service';
import {StatusRequest} from '../../types/status.types';
import {OrderCardComponent} from '../components/order-card/order-card.component';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  imports: [
    OrderCardComponent
  ],
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit{

 protected ordersNew: OrderMini[] = [];
  protected ordersInProgress: OrderMini[] = [];

  constructor(private orderService: OrderService) {
  }

  ngOnInit(): void {
    this.orderService.findOrdersByStatus(StatusRequest.NEW)
      .subscribe(data => {
        this.ordersNew = data;
      })
    this.orderService.findOrdersByStatus(StatusRequest.IN_PROGRESS)
      .subscribe(data => {
        this.ordersInProgress = data;
      })
  }
}
