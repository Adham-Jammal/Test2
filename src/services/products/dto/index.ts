import CustomObject from '../../dto/customObject';
import { SimpleShopDto } from '../../categories/dto/simpleShopDto';

export interface ProductCombinationCreationDto {
  price: number;
  quantity: number;
  colorId: number;
  sizeId: number;
}
export interface ProductCombinationDto extends ProductCombinationCreationDto {
  productId: number;
  uniqueID: string | null;
  colorName: string | null;
  colorCode: string | null;
  sizeName: string | null;
  id: number;
  price: number;
  quantity: number;
  colorId: number;
  sizeId: number;
}
export interface ColorDto {
  code: string | null;
  isActive: boolean;
  arName: string | null;
  enName: string | null;
  name: string | null;
  id: number;
}
export interface SizesDto {
  isActive: boolean;
  arName: string | null;
  enName: string | null;
  name: string | null;
  id: number;
}
export interface ProductDto {
  number: string | null;
  quantity: number;
  availableStock: number;
  imageUrl: string | null;
  arDescription: string | null;
  enDescription: string | null;
  description: string | null;
  price: number;
  shopId: number;
  shop: SimpleShopDto;
  creatorUserId: number | null;
  createdBy: string | null;
  creationTime: Date;
  classificationId: number;
  classificationName: string | null;
  gallery: string[];
  offerPrice: number | null;
  isFeatured: boolean;
  rate: number;
  ratesCount: number;
  soldCount: number;
  isFavorite: boolean;
  colors: ColorDto[];
  sizes: SizesDto[];
  combinations: ProductCombinationDto[];
  attributes: CustomObject<string>[];
  isActive: boolean;
  arName: string | null;
  enName: string | null;
  name: string | null;
  id: number;
}

export interface CreateProductDto {
  number: string;
  arName: string;
  enName: string;
  availableStock: number;
  imageUrl: string;
  shopId?: number;
  arDescription: string;
  enDescription: string;
  classificationId: number;
  gallery: string[];
  combinations: ProductCombinationCreationDto[];
  attributes: CustomObject<string>;
}

export interface ProductsPagedFilterRequest {
  maxResultCount?: number;
  skipCount?: number;
  keyword?: string;
  categoryId?: number;
  HasOffer?: boolean;
  OnlyFeatured?: boolean;
  classificationId?: number;
  shopId?: number;
  Sorting?: string;
  isActive?: boolean;
  productId?: number;
  myProducts?: boolean;
}

export interface UpdateProductDto {
  id: number;
  number: string;
  arName: string;
  enName: string;
  availableStock: number;
  imageUrl: string;
  shopId?: number;
  arDescription: string;
  enDescription: string;
  classificationId: number;
  gallery: string[];
  combinations: ProductCombinationCreationDto[];
  attributes: CustomObject<string>;
}
