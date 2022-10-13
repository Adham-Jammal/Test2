import { OfferType } from '../../../lib/types';

export interface UpdateOfferDto {
  id: number;
  startDate: string;
  endDate: string;
  type: OfferType;
  orderMinValue: number;
  productIDs: Array<number>;
  percentage: number;
}
