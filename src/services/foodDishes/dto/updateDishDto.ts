import { NutritionsDto } from '../../foodRecipe/dto/nutritionsDto';

export interface UpdateFoodDishDto {
  id: number;
  arName: string;
  enName: string;
  amountOfCalories?: number;
  standardServingAmount?: number;
  imageUrl?: string;
  isActive?: boolean;
  arAbout?: string;
  enAbout?: string;
  nutritions?: NutritionsDto[];
}
