import { OfferType } from '../../../lib/types';

export interface CreateOfferDto {
  startDate: string;
  endDate: string;
  type: OfferType;
  orderMinValue: number;
  productIDs: Array<number>;
  percentage: number;
}
