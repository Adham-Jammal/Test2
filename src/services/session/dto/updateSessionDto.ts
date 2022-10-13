import { ExerciseDto } from '../../exercise/dto/exerciseDto';

export interface UpdateSessiontDto {
  id: string;
  arTitle: string;
  enTitle: string;
  imageUrl: string;
  arDescription?: string;
  enDescription?: string;
  isActive?: boolean;
  exercises?: ExerciseDto[];
}
