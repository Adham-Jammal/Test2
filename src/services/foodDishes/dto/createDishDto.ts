import { NutritionsDto } from '../../foodRecipe/dto/nutritionsDto';

export interface CreateFoodDishDto {
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
