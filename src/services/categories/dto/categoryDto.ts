import { SimpleClassificationDto } from './simpleClassificationDto';
import { SimpleProductDto } from './simpleProductDto';
import { SimpleShopDto } from './simpleShopDto';

export interface CategoryDto {
  id: number;
  arName: string;
  enName: string;
  name: string;
  imageUrl?: string;
  isActive: boolean;
  order: number;
  ordersCount: number;
  classifications: Array<SimpleClassificationDto>;
  products: Array<SimpleProductDto>;
  productsCount: number;
  shops: Array<SimpleShopDto>;
}
