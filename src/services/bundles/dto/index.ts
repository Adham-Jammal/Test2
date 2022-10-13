/* eslint-disable */

import { BundlesPeriodType } from '../../../lib/types';

export interface CreateOrUpdateBundleDto {
  arName: string;
  enName: string;
  arDesc: string;
  enDesc: string;
  isDefault: boolean;
  periodInDays: number;
  price: number;
  periodType: BundlesPeriodType;
  id?: number;
}

export interface BundleDto {
  arName: string;
  enName: string;
  name: string;
  arDesc: string;
  enDesc: string;
  isDefault: boolean;
  periodInDays: number;
  price: number;
  periodType: BundlesPeriodType;
  id: number;
  isActive: boolean;
}

export interface BundlePagedResultDto {
  maxResultCount?: number;
  skipCount?: number;
  IsActive?: boolean;
  Sorting?: string;
  key?: string;
}
