import { LiteEntityDto } from './liteEntityDto';

export interface LocationDto {
  id: number;
  arName: string;
  flag: string;
  enName: string;
  parentId: number;
  parent: LiteEntityDto;
  isActive: boolean;
  shopsCount: number;
}
