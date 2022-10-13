export interface FoodCategoryPagedFilterRequest {
  maxResultCount?: number;
  skipCount?: number;
  isActive?: boolean;
  keyword?: string;
  advancedSearchKeyword?: string;
  sorting?: string;
}
