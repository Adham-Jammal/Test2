// import { SimpleShopDto } from '../../categories/dto/simpleShopDto';
import { CouponType } from '../../../lib/types';
import { SimpleShopDto } from '../../categories/dto/simpleShopDto';
import { LiteEntityDto } from '../../dto/liteEntityDto';

export interface CouponDto {
  startDate: string;
  endDate: string;
  code: string;
  discountPercentage: number;
  maxTotalUseCount: number;
  maxClientUseCount: number;
  shopId?: number;
  shop?: SimpleShopDto;
  isFreeShipping: boolean;
  eventOrganizerInfo: string;
  classifications: Array<LiteEntityDto>;
  id: number;
  createdBy: string;
  creationTime: string;
  isExpired: boolean;
  clients?: Array<LiteEntityDto>;
  type: CouponType;
}
