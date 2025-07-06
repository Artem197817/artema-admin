import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Status} from '../../../types/status.types';
import {OrderService} from '../../../services/order.service';

@Component({
  selector: 'app-change-status',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './change-status.component.html',
  styleUrl: './change-status.component.scss'
})
export class ChangeStatusComponent {

  @Input() orderId!: number;

  statuses = Object.values(Status).filter(s => s !== Status.NONE);
  selectedStatus: Status = Status.NEW;
  protected comment: string = '';

  constructor(private orderService: OrderService,) {}

  changeStatus() {
    if (!this.orderId) {
      alert('Order ID не задан');
      return;
    }

    const payload = {
      orderId: this.orderId,
      status: this.selectedStatus
    };

      this.orderService.changeOrderStatus(payload)
      .subscribe({
        next: () => alert('Статус успешно изменён'),
        error: err => {
          console.error('Ошибка при изменении статуса', err);
          alert('Ошибка при изменении статуса');
        }
      });
  }
}
