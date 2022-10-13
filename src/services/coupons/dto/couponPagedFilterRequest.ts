export interface CouponPagedFilterRequest {
  maxResultCount: number;
  skipCount: number;
  isActive?: boolean;
  keyword?: string;
  classificationId?: number;
  myCoupons?: boolean;
  shopId?: number;
  clientId?: number;
  isFreeShipping?: boolean;
}
