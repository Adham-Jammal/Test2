import { IngredientsDto } from './ingredientsDto';
import { NutritionsDto } from './nutritionsDto';
import { StepsDto } from './stepsDto';

export interface FoodRecipeDto {
  amountOfCalories: number;
  standardServingAmount: number;
  periodTime: number;
  imageUrl: string;
  arAbout: string;
  enAbout: string;
  about: string;
  creatorUserId: number;
  creationTime: string;
  createdBy: string;
  nutritions: NutritionsDto[];
  ingredients: Array<IngredientsDto>;
  steps: StepsDto[];
  isActive: boolean;
  arName: string;
  enName: string;
  name: string;
  foodCategoryId: number;
  id: number;
}
