import { ReportRefType } from '../../../lib/types';

export interface ReportPagedFilterRequest {
  maxResultCount: number;
  skipCount: number;
  refType?: ReportRefType;
  keyword?: string;
  refId?: number;
}
