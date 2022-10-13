import { OrderType, PaymentMethod } from '../../../lib/types';
import { SimpleClientDto } from '../../clients/dto/simpleClientDto';
import { LiteEntityDto } from '../../locations/dto/liteEntityDto';
import { OrderItemDto } from './orderItemDto';

export interface OrderDto {
  id: number;
  number: string;
  shop: LiteEntityDto;
  client: SimpleClientDto;
  paymentMethod: PaymentMethod;
  fees: number;
  status: OrderType;
  creationTime: string;
  items: Array<OrderItemDto>;
  totalOrderFee: number;
  invoice: string;
}
