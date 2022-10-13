export interface UpdateNewsDto {
  id: number;
  imageUrl: string;
  arName: string;
  enName: string;
  arDescription: string;
  enDescription: string;
  sourceName: string;
  sourceLogo: string;
  tags?: string[];
  cities: string[];
  categoryId: string | number;
  fromDate: string;
  toDate: string;
  arSourceName: string;
  enSourceName: string;
}
