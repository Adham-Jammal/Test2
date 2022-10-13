export interface CreateCouponDto {
  startDate: string;
  endDate: string;
  code: string;
  shopId?: number;
  clientIds?: Array<number>;
  discountPercentag: number;
  maxTotalUseCount: number;
  maxClientUseCount: number;
  isFreeShipping: boolean;
  eventOrganizerInfo?: string;
  classifications?: Array<number>;
}
