import { OfferType } from '../../../lib/types';
import { LiteEntityDto } from '../../locations/dto/liteEntityDto';

export interface OfferDto {
  startDate: string;
  endDate: string;
  type: OfferType;
  orderMinValue: number;
  products: Array<LiteEntityDto>;
  percentage: number;
  creationTime: string;
  id: number;
  isActive: boolean;
}
