import {Component, Input} from '@angular/core';
import {OrderMini} from '../../../types/order-mini.type';
import {TruncateTextPipe} from '../../../utils/truncate-text.pipe';
import {RouterLink} from '@angular/router';
import {ChangeStatusComponent} from '../change-status/change-status.component';

@Component({
  selector: 'order-card',
  standalone: true,
  templateUrl: './order-card.component.html',
  imports: [
    TruncateTextPipe,
    RouterLink,
    ChangeStatusComponent
  ],
  styleUrl: './order-card.component.scss'
})
export class OrderCardComponent {

  @Input() order!: OrderMini;

  isChangeStatusActive: boolean = false;

  changeisStatusActive() {
    this.isChangeStatusActive = !this.isChangeStatusActive;
  }
}
