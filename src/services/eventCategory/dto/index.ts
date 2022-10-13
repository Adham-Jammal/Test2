export interface CreateOrUpdateEventCategoryDto {
  arNam: string;
  enName: string;
  id?: number;
}
export interface EventCategoryDto {
  isActive: boolean;
  arName: string;
  enName: string;
  name: string;
  id: number;
}

export interface EventCategoryPagedFilterRequest {
  maxResultCount: number;
  skipCount: number;
  isActive?: boolean;
  keyword?: string;
}
