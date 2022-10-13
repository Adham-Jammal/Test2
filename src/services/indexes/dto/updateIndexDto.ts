import { IndexType } from '../../../lib/types';

export interface UpdateIndexDto {
  id: number;
  arName: string;
  enName: string;
  type: IndexType;
}
