import { PaymentMethod } from '../../../lib/types';
import { LiteEntityDto } from '../../locations/dto/liteEntityDto';

export interface PaymentDto {
  transactionId: string;
  receiptId: number;
  receipt: LiteEntityDto;
  senderId: number;
  sender: LiteEntityDto;
  amount: number;
  creationTime: string;
  method: PaymentMethod;
  orderNumber: string;
  status: string;
  fee: number;
  orderId: number;
  shopId: number;
  message: string;
  id: number;
}
