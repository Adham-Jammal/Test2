/* eslint-disable */
import { ShopType } from '../../../lib/types';
import { LiteEntityDto } from '../../locations/dto/liteEntityDto';
import { PaymentDto } from '../../payments/dto/paymentDto';

export interface ShopDto {
  code: string;
  arName: string;
  ownerEmail: string;
  ownerName: string;
  enName: string;
  managerEmail: string;
  manager: SimpleShopManagerDto;
  name: string;
  email: string;
  ownerCountryCode: string;
  ownerPhoneNumber: string;
  productsCount: number;
  ordersCount: number;
  city: LiteEntityDto;
  logoUrl: string;
  arLogoUrl: string;
  enLogoUrl: string;
  coverUrl: string;
  arCoverUrl: string;
  enCoverUrl: string;
  description: string;
  arDescription: string;
  enDescription: string;
  latitude: number;
  longitude: number;
  reasonCreatingShop: ReasonCreatingShop;
  expectedMonthlySales: ExpectedMonthlySales;
  minOrderHours: number;
  minOrderPrice: number;
  balance: number;
  id: number;
  isActive: boolean;
  type: ShopType;
  ratings: any;
  rate: number;
  reviews: any;
  banks: Array<ShopBankDto>;
  shopBundles: Array<any>;
  followersCount: number;
  categories: Array<LiteEntityDto>;
  payments: Array<PaymentDto>;
}

export interface ShopBankDto {
  bankId: number;
  bankName: string;
}
export interface CompletShopRegistrationDto {
  arName: string;
  enName: string;
  type: ShopType;
  arLogoUrl: string;
  enLogoUrl: string;
  arCoverUrl: string;
  enCoverUrl: string;
  arDescription: string;
  enDescription: string;
  cityId: number;
  latitude: number;
  longitude: number;
  bundleId: number;
  categories: Array<number>;
  banks: Array<number>;
  reasonCreatingShop: ReasonCreatingShop;
  expectedMonthlySales: ExpectedMonthlySales;
}

export interface SimpleShopManagerDto {
  ownerName: string;
  ownerSurname: string;
  shopName: string;
  categories: Array<LiteEntityDto>;
  emailAddress: string;
  phoneNumber: string;
  countryCode: string;
  joinDate: string;
  city: LiteEntityDto;
  productsCount: number;
  ordersCount: number;
  totalIncome: number;
  lastLoginDate: string;
  status: number;
  shopId: number;
  imageUrl: string;
  id: number;
}

export enum ReasonCreatingShop {
  MovingFromAnotherPlatform = 0,
  Exploration = 1,
  SettingUpForAnotherShop = 2,
  TransferringTraditionalCommerceToElectronic = 3,
}
export enum ExpectedMonthlySales {
  LessThanTenThousand = 0,
  LessThanHundredThousand = 1,
  FiveHundredThousandAndMore = 2,
}
