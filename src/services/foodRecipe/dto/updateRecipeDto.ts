export interface UpdateFoodRecipeDto {
  id: number;
  foodCategoryId: number;
  arName: string;
  enName: string;
  amountOfCalories: number;
  standardServingAmount: number;
  periodTime: number;
  imageUrl: string;
  arAbout: string;
  enAbout: string;
  isActive?: boolean;
  nutritions?: [];
  ingredients?: [];
  steps?: [];
}
