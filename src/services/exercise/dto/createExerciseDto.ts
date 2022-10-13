export interface CreateExercisetDto {
  arTitle: string;
  enTitle: string;
  amountOfCalories: number;
  durationInMinutes: number;
  imageUrl: string;
  arDescription?: string;
  enDescription?: string;
}
