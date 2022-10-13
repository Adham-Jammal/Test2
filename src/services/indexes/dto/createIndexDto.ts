import { IndexType } from '../../../lib/types';

export interface CreateIndexDto {
  arName: string;
  enName: string;
  type: IndexType;
}
