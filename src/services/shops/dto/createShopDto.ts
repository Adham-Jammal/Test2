import { ShopType } from '../../../lib/types';
import { ExpectedMonthlySales, ReasonCreatingShop } from './shopDto';

export interface CreateOrUpdateShopDto {
  ownerName: string;
  arName: string;
  enName: string;
  ownerEmail: string;
  ownerCountryCode: string;
  ownerPhoneNumber: string;
  cityId: number;
  password: string;
  type: ShopType;
  arLogoUrl: string;
  enLogoUrl: string;
  arCoverUrl: string;
  enCoverUrl: string;
  arDescription: string;
  enDescription: string;
  latitude: number;
  longitude: number;
  bundleId: number;
  reasonCreatingShop: ReasonCreatingShop;
  expectedMonthlySales: ExpectedMonthlySales;
  categories: Array<number>;
  banks: Array<number>;
  id?: number;
}
