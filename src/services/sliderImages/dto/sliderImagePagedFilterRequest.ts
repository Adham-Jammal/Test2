export interface SliderImagePagedFilterRequest {
  maxResultCount: number;
  skipCount: number;
  isActive?: boolean;
  keyword?: string;
  shopId?: number;
  myPromotions?: boolean;
}
