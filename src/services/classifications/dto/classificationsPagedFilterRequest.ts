export interface ClassificationPagedFilterRequest {
  maxResultCount?: number;
  skipCount?: number;
  type?: number;
  categoryId?: number;
  isActive?: boolean;
  keyword?: string;
}
