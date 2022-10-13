export interface UpdateCouponDto {
  id: number;
  startDate: string;
  endDate: string;
  code: string;
  shopId?: number;
  discountPercentag: number;
  maxTotalUseCount: number;
  maxClientUseCount: number;
  isFreeShipping: boolean;
  eventOrganizerInfo?: string;
  classifications?: Array<number>;
  clientIds?: Array<number>;
}
