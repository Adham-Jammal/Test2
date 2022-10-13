import { AzkarCategory } from '../../../lib/types';

export interface CreateOrUpdateAzkarDto {
  arTitle: string | null;
  enTitle: string | null;
  fromDate: Date;
  toDate: Date;
  arContent: string;
  enContent: string;
  isActive: boolean;
  category: AzkarCategory;
  id?: number;
}

export interface AzkarDto {
  arTitle: string | null;
  enTitle: string | null;
  title: string | null;
  content: string;
  fromDate: Date;
  toDate: Date;
  isActive: boolean;
  arContent: string;
  enContent: string;
  category: number;
  creatorUserId: number | null;
  createdBy: string | null;
  creationTime: Date;
  id: number;
}

export interface AzkarPagedResultDto {
  maxResultCount?: number;
  skipCount?: number;
  keyword?: string;
  IsActive?: boolean;
  CategoryId?: number;
  MinCreationTime?: string;
  MaxCreationTime?: string;
  Sorting?: string;
}
