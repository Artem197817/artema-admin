import {Component, Input} from '@angular/core';
import {OrderMini} from '../../../types/order-mini.type';
import {TruncateTextPipe} from '../../../utils/truncate-text.pipe';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'order-card',
  standalone: true,
  templateUrl: './order-card.component.html',
  imports: [
    TruncateTextPipe,
    RouterLink
  ],
  styleUrl: './order-card.component.scss'
})
export class OrderCardComponent {

  @Input() order!: OrderMini;
}
