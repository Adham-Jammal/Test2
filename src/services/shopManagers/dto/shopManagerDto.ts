import { UserStatus } from '../../../lib/types';
import { LiteEntityDto } from '../../locations/dto/liteEntityDto';
import { ShopDto } from '../../shops/dto/shopDto';

export interface ShopManagerDto {
  ownerName: string;
  ownerSurname: string;
  shopName: string;
  categories: Array<LiteEntityDto>;
  id: number;
  emailAddress: string;
  phoneNumber: string;
  countryCode: string;
  joinDate: string;
  status: UserStatus;
  city: LiteEntityDto;
  productsCount: number;
  ordersCount: number;
  totalIncome: number;
  shopId: number;
  imageUrl: string;
  lastLoginDate: string;
  shop: ShopDto;
}

export interface RegisterShopManagerDto {
  name: string;
  surname: string;
  emailAddress: string;
  phoneNumber: string;
  password: string;
}

export interface UpdateShopManagerDto {
  name: string;
  surname: string;
  emailAddress: string;
  phoneNumber?: string;
  countryCode?: string;
  id: number;
  shopCompanyName?: string;
  shopEmail?: string;
  shopOwnerCountryCode: string;
  shopOwnerPhoneNumber: string;
  shopArLogoUrl: string;
  shopEnLogoUrl: string;
  shopArCoverUrl: string;
  shopEnCoverUrl: string;
  shopArDescription: string;
  shopEnDescription: string;
  shopArName: string;
  shopEnName: string;
}
