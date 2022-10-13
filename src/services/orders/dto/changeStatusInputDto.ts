import { OrderType } from '../../../lib/types';

export interface ChangeStatusInputDto {
  id: number;
  status: OrderType;
}
