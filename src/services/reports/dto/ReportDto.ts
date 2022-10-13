import { ReportRefType } from '../../../lib/types';
import { SimpleClientDto } from '../../clients/dto/simpleClientDto';

export interface ReportDto {
  description: string;
  creationTime: string;
  reporterId: number;
  reporter: SimpleClientDto;
  refId: number;
  refType: ReportRefType;
  id: number;
}
