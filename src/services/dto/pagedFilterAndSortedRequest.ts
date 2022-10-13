export interface PagedFilterAndSortedRequest {
  maxResultCount?: number;
  skipCount?: number;
  keyword?: string;
  isActive?: boolean;
  type?: number;
  sorting?: string;
  advancedSearchKeyword?: string;
}
