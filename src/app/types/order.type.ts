import { Status } from "./status.types";

export interface OrderStatus {
    status: Status;
    dateOfChange: string; // ISO date string, e.g. '2025-05-29'
    comment?: string;
  }

  // Payment Interface
  export interface Payment {
    payment: number;
    paymentData: string;
    comment?: string;
    orderId?: number;
  }

  // OrderFile Interface
  export interface OrderFile {
    id: number;
    fileName: string;
    contentType: string;
    data: any; // Обычно это base64-строка или Blob, зависит от API
  }

  // OrderPayment Interface
  export interface OrderPayment {
    id: number;
    orderId: number;
    lastPayment: Payment;
    amount: number;
    comment?: string;
    listHistoryPayment: Payment[];
  }

  // Order Interface
  export interface Order {
    orderId: number;
    customerId: number;
    orderName?: string;
    orderPrice?: string;
    orderDescription?: string;
    orderStatus: OrderStatus;
    orderStatusHistory?: OrderStatus[];
    orderFiles?: OrderFile[];
  }
