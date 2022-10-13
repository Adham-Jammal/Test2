export interface CreateFoodRecipeDto {
  arName: string;
  enName: string;
  amountOfCalories: number;
  standardServingAmount: number;
  periodTime: number;
  imageUrl: string;
  arAbout: string;
  enAbout: string;
  isActive?: boolean;
  foodCategoryId: number;
  nutritions?: [];
  ingredients?: [];
  steps?: [];
}
