export interface UpdateExercisetDto {
  id: string;
  arTitle: string;
  enTitle: string;
  amountOfCalories: number;
  durationInMinutes: number;
  imageUrl: string;
  arDescription?: string;
  enDescription?: string;
}
