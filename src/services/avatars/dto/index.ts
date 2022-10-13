import { GenderType, MonthName } from '../../../lib/types';

export interface CreateOrUpdateAvatarDto {
  image: string;
  arDescription: string;
  enDescription: string;
  gender: GenderType;
  month: MonthName;
  arName: string;
  enName: string;
  id?: number;
}

export interface AvatarDto {
  image: string;
  arDescription: string;
  enDescription: string;
  description: string;
  gender: GenderType;
  month: MonthName;
  isActive: boolean;
  arName: string;
  enName: string;
  name: string;
  id: number;
}

export interface AvatarPagedResultDto {
  maxResultCount?: number;
  skipCount?: number;
  IsActive?: boolean;
  Sorting?: string;
  keyword?: string;
}
