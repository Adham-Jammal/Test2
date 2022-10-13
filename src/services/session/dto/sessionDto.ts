import { ExerciseDto } from '../../exercise/dto/exerciseDto';

export interface SessionDto {
  timeInMinutes: number;
  amountOfCalories: number;
  arTitle: string;
  enTitle: string;
  title: string;
  imageUrl: string;
  arDescription: string;
  enDescription: string;
  description: string;
  creatorUserId: number;
  creationTime: string;
  createdBy: string;
  lastModifierUserId: number;
  lastModificationTime: string;
  modifiedBy: string;
  exercises: ExerciseDto[];
  isActive: boolean;
  id: number;
}
