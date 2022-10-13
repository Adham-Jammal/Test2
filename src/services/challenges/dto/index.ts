/* eslint-disable */

export interface CreateOrUpdateChallengeDto {
  arTitle: string;
  enTitle: string;
  arDescription: string;
  enDescription: string;
  organizer: string;
  points: string;
  imageUrl: string;
  id?: number;
  minNumOfInvitee: number;
  firstLocationLongitude: string;
  firstLocationLatitude: string;
  firstLocationName: string;
  targetLocationLongitude: string;
  targetLocationLatitude: string;
  targetLocationName: string;
}

export interface ChallengeDto {
  title: string;
  arTitle: string;
  enTitle: string;
  description: string;
  arDescription: string;
  enDescription: string;
  minNumOfInvitee: number;
  organizer: string;
  firstLocationLongitude: string;
  firstLocationLatitude: string;
  firstLocationName: string;
  targetLocationLongitude: string;
  targetLocationLatitude: string;
  targetLocationName: string;
  points: number;
  date: string;
  isActive: boolean;
  imageUrl: string;
  creatorUserId: number | null;
  createdBy: string;
  creationTime: Date;
  isJoined: boolean;
  id: number;
  isExpired: boolean;
  currentStep: StepType;
}
export enum StepType {
  NotJoined = 0,
  Joined = 1,
  InviteFriends = 2,
  VerifiedMoment = 3,
  ClaimRewards = 4,
}
export enum DishType {
  Breakfast = 0,
  Dinner = 1,
  Launch = 2,
  Snak = 3,
}

export interface ChallengePagedResultDto {
  maxResultCount?: number;
  skipCount?: number;
  IsActive?: boolean;
  IsExpired?: boolean;
  Sorting?: string;
  keyword?: string;
  myChallenges?: boolean;
}
