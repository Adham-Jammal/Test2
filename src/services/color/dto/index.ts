export interface CreateColorDto {
  arName: string;
  enName: string;
  code: string;
}

export interface ColorDto {
  code: string | null;
  isActive: boolean;
  arName: string | null;
  enName: string | null;
  name: string | null;
  id: number;
}

export interface UpdateColorDto extends CreateColorDto {
  id: number;
}

 export interface ColorPagedResultDto{
    totalCount:number,
    items:ColorDto[], 
}

 export interface ColorsPagedFilterRequest{
  maxResultCount?: number;
  skipCount?: number;
  keyword?: string;
  isActive?: boolean;
  advancedSearchKeyword?: string;
  Sorting?:string
}
