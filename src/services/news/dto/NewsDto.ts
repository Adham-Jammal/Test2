export interface NewsDto {
  sourceLogo: string;
  imageUrl: string;
  arDescription: string;
  enDescription: string;
  description: string;
  isActive: boolean;
  arTitle: string;
  enTitle: string;
  title: string;
  id: number;
  sourceName?: string;
  tags?: string[];
  arSourceName: string;
  enSourceName: string;
  cities: string[];
  categoryId: string | number;
  fromDate: string;
  toDate: string;
  createdBy: string;
  creationTime: string;
  category: any;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  savedCount: number;
}
