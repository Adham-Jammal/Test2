export interface CreateNewsDto {
  imageUrl: string;
  arName: string;
  enName: string;
  arDescription: string;
  enDescription: string;
  arSourceName: string;
  enSourceName: string;
  sourceName: string;
  sourceLogo: string;
  tags?: string[];
  cities: string[];
  categoryId: string | number;
  fromDate: string;
  toDate: string;
}
