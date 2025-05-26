import {Status} from './status.types';

export interface OrderDTOMini {

  customerName: string;
  customerLastName?: string;
  customerEmail: string;
  customerPhone: string;

  orderId: number;
  orderName?: string;
  orderDescription?: string;

  orderStatus: Status;
}
