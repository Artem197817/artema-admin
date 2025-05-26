import {Status} from './status.types';

export interface OrderMini {

  customerName: string;
  customerLastName?: string;
  customerEmail: string;
  customerPhone: string;

  orderId: number;
  orderName?: string;
  orderDescription?: string;

  orderStatus: Status;
}
