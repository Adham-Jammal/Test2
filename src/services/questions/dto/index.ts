import { QuestionType } from '../../../lib/types';

export interface QuestionChoiceDto {
  arContent: string;
  enContent: string;
  imageUrl: string;
}

export interface CreateOrUpdateQuestionDto {
  type: QuestionType;
  arContent: string;
  enContent: string;
  order: number;
  isActive: boolean;
  choices: Array<QuestionChoiceDto>;
  id?: number;
}

export interface QuestionDto {
  type: QuestionType;
  arContent: string;
  enContent: string;
  content: string;
  order: number;
  choices: Array<QuestionChoiceDto>;
  createdBy: string;
  creatorUserId: number;
  creationTime: Date;
  id: number;
  isActive: boolean;
}

export interface QuestionPagedResultDto {
  maxResultCount?: number;
  skipCount?: number;
  IsActive?: boolean;
  Sorting?: string;
  keyword?: string;
}
