import { NutritionsDto } from '../../foodRecipe/dto/nutritionsDto';

export interface FoodDishDto {
  amountOfCalories: number;
  standardServingAmount: number;
  imageUrl: string;
  arAbout: string;
  enAbout: string;
  about: string;
  creatorUserId: number;
  foodCategoryId: number;
  foodCategoryName: string;
  creationTime: string;
  createdBy: string;
  nutritions: NutritionsDto[];
  isActive: boolean;
  arName: string;
  enName: string;
  name: string;
  id: number;
}
