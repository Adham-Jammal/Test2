export interface CategoryFilterInputDto {
  maxResultCount: number;
  skipCount: number;
  keyword?: string;
  isActive?: boolean;
  type?: number;
}
