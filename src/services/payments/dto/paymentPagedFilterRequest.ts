import { PaymentMethod } from '../../../lib/types';

export interface PaymentPagedFilterRequest {
  maxResultCount: number;
  skipCount: number;
  isActive?: boolean;
  keyword?: string;
  shopId?: number;
  method?: PaymentMethod;
}
