import { ExerciseDto } from '../../exercise/dto/exerciseDto';

export interface CreateSessiontDto {
  arTitle: string;
  enTitle: string;
  imageUrl: string;
  arDescription?: string;
  enDescription?: string;
  isActive?: boolean;
  exercises?: ExerciseDto[];
}
