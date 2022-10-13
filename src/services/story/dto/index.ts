import { StoryType } from '../../../lib/types';

export interface StoryImageItemDto {
  isVideo: boolean;
  fileUrl: string;
  order: number;
  storyId: number;
  id: number;
}

export interface UpdateStoriesOrderDto {
  stories: Array<StoryOrder>;
}
export interface StoryOrder {
  order: number;
  id: number;
}

export interface StoryDto {
  viewsCount: number;
  likesCount: number;
  order: number;
  disLikesCount: number;
  arTitle: string;
  enTitle: string;
  title: string;
  arDescription: string;
  enDescription: string;
  description: string;
  imageUrl: string;
  hours: number;
  videoLink: string;
  creatorUserId: number;
  createdBy: string;
  creationTime: string;
  isActive: boolean;
  isLiked: boolean;
  id: number;
  voiceLink: string;
  isExpired: boolean;
}

export interface CreateStoryDto {
  arTitle: string;
  enTitle: string;
  arDescription: string;
  enDescription: string;
  imageUrl?: string;
  hours: number;
  videoLink?: string;
  voiceLink?: string;
}

export interface UpdateStoryDto {
  id: string | number;
  arTitle: string;
  enTitle: string;
  arDescription: string;
  enDescription: string;
  imageUrl?: string;
  hours: number;
  videoLink?: string;
  voiceLink?: string;
}

export interface StoryFilterAndSortedReq {
  maxResultCount?: number;
  skipCount?: number;
  IsActive?: boolean;
  keyword?: string;
  advancedSearchKeyword?: string;
  sorting?: string;
  type?: StoryType;
}
