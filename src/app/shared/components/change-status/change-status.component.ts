import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ChangeStatusType, Status} from '../../../types/status.types';
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

  protected statuses = Object.values(Status).filter(s => s !== Status.NONE);
  protected selectedStatus: Status = Status.NEW;
  protected comment: string = '';
  protected isCommentBlockActive: boolean = false;
  private payload = {} as ChangeStatusType;


  constructor(private orderService: OrderService,) {}

  protected isCommentBlocActivated(){
    this.isCommentBlockActive = true;
  }
  changeStatus() {
    if (!this.orderId) {
      alert('Order ID не задан');
      return;
    }

      this.payload.orderId = this.orderId;
      this.payload.status = this.selectedStatus;


      this.orderService.changeOrderStatus(this.payload)
      .subscribe({
        next: () => alert('Статус успешно изменён'),
        error: err => {
          console.error('Ошибка при изменении статуса', err);
          alert('Ошибка при изменении статуса');
        }
      });
  }

  changeStatusWithoutComment() {
    this.isCommentBlockActive = false;
    this.changeStatus();
  }

  changeStatusWithComment() {
    this.payload.comment = this.comment;
    this.isCommentBlockActive = false;
    this.changeStatus();
  }


}
