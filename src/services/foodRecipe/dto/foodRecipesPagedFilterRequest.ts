export interface FoodRecipesPagedFilterRequest {
  maxResultCount?: number;
  skipCount?: number;
  IsActive?: boolean;
  keyword?: string;
  advancedSearchKeyword?: string;
  sorting?: string;
}
