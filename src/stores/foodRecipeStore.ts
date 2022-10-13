import { action, observable } from 'mobx';
import { notifySuccess } from '../lib/notifications';
import { EntityDto } from '../services/dto/entityDto';
import type { CreateFoodRecipeDto } from '../services/foodRecipe/dto/createRecipeDto';
import type { FoodRecipeDto } from '../services/foodRecipe/dto/recipeDto';
import type { UpdateFoodRecipeDto } from '../services/foodRecipe/dto/updateRecipeDto';
import foodRecipesService from '../services/foodRecipe/foodRecipesService';
import { GetCurrentLoginInformations } from '../services/session/dto/getCurrentLoginInformations';
import StoreBase from './storeBase';

class FoodRecipesStore extends StoreBase {
  @observable currentLogin: GetCurrentLoginInformations = new GetCurrentLoginInformations();

  @observable foodRecipes: Array<FoodRecipeDto> = [];

  @observable loadingFoodRecipes = true;

  @observable isSubmittingFoodRecipes = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable foodRecipesModel?: FoodRecipeDto = undefined;

  @observable keyword?: string = undefined;

  @observable advancedSearchKeyword?: string = undefined;

  @observable IsActive?: boolean = undefined;

  @observable sorting?: string = undefined;

  @action
  async getAllFoodRecipes() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await foodRecipesService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          advancedSearchKeyword: this.advancedSearchKeyword,
          IsActive: this.IsActive,
          sorting: this.sorting,
        });
        this.foodRecipes = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingFoodRecipes = true;
      },
      () => {
        this.loadingFoodRecipes = false;
      }
    );
  }

  @action
  async createFoodRecipe(input: CreateFoodRecipeDto) {
    await this.wrapExecutionAsync(
      async () => {
        await foodRecipesService.createFoodRecipe(input);
        await this.getAllFoodRecipes();
        notifySuccess();
      },
      () => {
        this.isSubmittingFoodRecipes = true;
      },
      () => {
        this.isSubmittingFoodRecipes = false;
      }
    );
  }

  @action
  async updateFoodRecipe(input: UpdateFoodRecipeDto) {
    await this.wrapExecutionAsync(
      async () => {
        await foodRecipesService.updateFoodRecipe(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingFoodRecipes = true;
      },
      () => {
        this.isSubmittingFoodRecipes = false;
      }
    );
  }

  @action
  async getFoodRecipe(input: EntityDto) {
    const recipe = await foodRecipesService.getFoodRecipe(input);
    if (recipe !== undefined) {
      this.foodRecipesModel = {
        id: recipe.id,
        imageUrl: recipe.imageUrl,
        arName: recipe.arName,
        enName: recipe.enName,
        name: recipe.name,
        createdBy: recipe.createdBy,
        creationTime: recipe.creationTime,
        arAbout: recipe.arAbout,
        enAbout: recipe.enAbout,
        about: recipe.about,
        creatorUserId: recipe.creatorUserId,
        nutritions: recipe.nutritions,
        standardServingAmount: recipe.standardServingAmount,
        isActive: recipe.isActive,
        amountOfCalories: recipe.amountOfCalories,
        ingredients: recipe.ingredients,
        periodTime: recipe.periodTime,
        steps: recipe.steps,
        foodCategoryId: recipe.foodCategoryId,
      };
    }
  }

  @action
  async foodRecipeActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await foodRecipesService.foodRecipeActivation(input);
        await this.getAllFoodRecipes();
        notifySuccess();
      },
      () => {
        this.loadingFoodRecipes = true;
      },
      () => {
        this.loadingFoodRecipes = false;
      }
    );
  }

  @action
  async foodRecipeDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await foodRecipesService.foodRecipeDeactivation(input);
        await this.getAllFoodRecipes();
        notifySuccess();
      },
      () => {
        this.loadingFoodRecipes = true;
      },
      () => {
        this.loadingFoodRecipes = false;
      }
    );
  }
}

export default FoodRecipesStore;
