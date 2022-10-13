import { LiteEntityDto } from '../../locations/dto/liteEntityDto';

export interface ClassificationDto {
  id: number;
  arName: string;
  enName: string;
  productsCount: number;
  ordersCount: number;
  imageUrl?: string;
  category: LiteEntityDto;
  isActive: boolean;
  events: Array<LiteEntityDto>;
}
