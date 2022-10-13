import { EmailTargetType } from '../../../lib/types';

export interface SpecialEmailDto {
  ids: Array<number>;
  subject: string;
  content: string;
  target: EmailTargetType;
  forAll: boolean;
  mustBeConfierEmail?: boolean;
}
