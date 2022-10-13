import { ReviewRefType } from '../../../lib/types';

export interface ReviewsPagedFilterRequest {
  maxResultCount: number;
  skipCount: number;
  refType?: ReviewRefType;
  keyword?: string;
  refId?: number;
  isHidden: boolean;
}
