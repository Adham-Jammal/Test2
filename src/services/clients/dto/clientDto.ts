import {
  AppointmentReminder,
  AppointmentRepeat,
  CommentRefType,
  GenderType,
  InteractionRefType,
  InteractionType,
  LifeDreamStepStatus,
  ToDoPriority,
  UserStatus,
} from '../../../lib/types';
import { ChallengeDto } from '../../challenges/dto';
import { ExerciseDto } from '../../exercise/dto/exerciseDto';
import { LiteEntityDto } from '../../locations/dto/liteEntityDto';
import { SimpleClientDto } from './simpleClientDto';

export interface ClientDto {
  id: number;
  name: string;
  surname: string;
  emailAddress: string;
  status: UserStatus;
  fullName?: string;
  code: string;
  creationTime?: string;
  phoneNumber: string;
  city?: LiteEntityDto;
  countryCode: string;
  addresses: Array<AddressDto>;
  paymentsCount: number;
  gender: GenderType;
  hasAvatar: boolean;
  imageUrl: string;
  birthDate: string;
  userName: string;
  lastLoginTime: string;
}
export interface AddressDto {
  cityId: number;
  city: LiteEntityDto;
  street: string;
  description: string;
  latitude: number;
  longitude: number;
  id: number;
}

export interface HealthProfileAnswerDto {
  questioId: number;
  arQuestion: string;
  enQuestion: string;
  question: string;
  arAnswer: string;
  enAnswer: string;
  answer: string;
}
export interface AnswerOutPutDto {
  question: string;
  choice: string;
}
export interface ToDoTaskDto {
  title: string;
  date: string;
  clientId: number;
  priority: ToDoPriority;
  isAchieved: boolean;
  id: number;
}

export interface ClientPagedFilterRequest {
  maxResultCount?: number;
  skipCount?: number;
  clientId?: number;
}

export interface AppointmentDto {
  title: string;
  allDays: boolean;
  note: string;
  startDate: string;
  endDate: string;
  fromHour: string;
  toHour: string;
  clients: Array<SimpleClientDto>;
  priority: ToDoPriority;
  repeat: AppointmentRepeat;
  reminder: AppointmentReminder;
  clientId: number;
  creatorUserId: number;
  createdBy: string;
  creationTime: string;
  isDone: boolean;
  id: number;
}

export interface PositiveHabitDto {
  title: string;
  description: string;
  imageUrl: string;
  clientId: number;
  date: string;
  id: number;
}

export interface LifeDreamStepDto {
  title: string;
  order: number;
  status: LifeDreamStepStatus;
  id: number;
}
export interface LifeDreamDto {
  title: string;
  imageUrl: string;
  steps: Array<LifeDreamStepDto>;
  isAchieved: boolean;
  totalStepsCount: number;
  clientId: number;
  achievedStepsCount: number;
  pendingStepsCount: number;
  creatorUserId: number;
  creationTime: string;
  id: number;
}

export interface SimpleSessionDto {
  exercises: Array<ExerciseDto>;
  arTitle: string;
  enTitle: string;
  title: string;
  imageUrl: string;
  timeInMinutes: number;
  amountOfCalories: number;
}

export interface DailySessionDto {
  exerciseSessionId: number;
  clientId: number;
  creatorUserId: number;
  creationTime: string;
  trainingKcal: number;
  walkingKcal: number;
  session: SimpleSessionDto;
  id: number;
}

export interface CommentDto {
  text: string;
  refId: string;
  refType: CommentRefType;
  creationTime: string;
  clientId: number;
  client: SimpleClientDto;
  id: number;
}

export interface InteractionDto {
  refId: string;
  interactionType: InteractionType;
  refType: InteractionRefType;
  creationTime: string;
  clientId: number;
  client: SimpleClientDto;
  id: number;
}

export interface MomentVideoDto {
  videoUrl: string;
  description: string;
}

export interface MomentDto {
  commentsCount: number;
  comments: Array<CommentDto>;
  interactions: Array<InteractionDto>;
  videos: Array<MomentVideoDto>;
  tags: Array<MomentTagDto>;
  interactionsCount: number;
  feelingIconUrl: string;
  long: number;
  lat: number;
  placeName: string;
  songName: string;
  songId: string;
  caption: string;
  imageUrl: string;
  createdBy: string;
  clientId: number;
  client: SimpleClientDto;
  creatorUserId: number;
  creationTime: string;
  challengeId: number;
  challenge: ChallengeDto;
  id: number;
}

export interface MomentTagDto {
  clientId: number;
  clientName: string;
}
