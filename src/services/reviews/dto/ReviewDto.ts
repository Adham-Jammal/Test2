import { ReviewRefType } from '../../../lib/types';
import { SimpleClientDto } from '../../clients/dto/simpleClientDto';

export interface ReviewDto {
  rate: number;
  comment: string;
  creationTime: string;
  isHidden: boolean;
  reviewerId: number;
  reviewer: SimpleClientDto;
  refId: number;
  refType: ReviewRefType;
  id: number;
}
