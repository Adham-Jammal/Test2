import { OrderType } from '../../../lib/types';

export interface OrdersPagedFilterRequest {
  maxResultCount: number;
  skipCount: number;
  clientId?: number;
  shopId?: number;
  status?: OrderType;
  keyword?: string;
  MyOrders?: boolean;
}
