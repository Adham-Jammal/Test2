/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { FoodRecipeDto } from './dto/recipeDto';
import { CreateFoodRecipeDto } from './dto/createRecipeDto';
import { UpdateFoodRecipeDto } from './dto/updateRecipeDto';
import { FoodRecipesPagedFilterRequest } from './dto/foodRecipesPagedFilterRequest';

class foodRecipesService {
  public async getAll(
    input: FoodRecipesPagedFilterRequest
  ): Promise<PagedResultDto<FoodRecipeDto>> {
    const result = await http.get('api/services/app/Recipe/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        IsActive: input.IsActive,
        keyword: input.keyword,
        advancedSearchKeyword: input.advancedSearchKeyword,
        Sorting: input.sorting,
      },
    });
    return result.data.result;
  }

  public async getFoodRecipe(input: EntityDto): Promise<FoodRecipeDto> {
    const result = await http.get('api/services/app/Recipe/Get', {
      params: { id: input.id },
    });
    return result.data.result;
  }

  public async createFoodRecipe(input: CreateFoodRecipeDto): Promise<FoodRecipeDto> {
    const result = await http.post('api/services/app/Recipe/Create', input);
    return result.data;
  }

  public async updateFoodRecipe(input: UpdateFoodRecipeDto): Promise<FoodRecipeDto> {
    const result = await http.put('api/services/app/Recipe/Update', input);
    return result.data;
  }

  public async foodRecipeDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/Recipe/DeActivate', input);
    return result.data;
  }

  public async foodRecipeActivation(input: EntityDto) {
    const result = await http.put('api/services/app/Recipe/Activate', input);
    return result.data;
  }
}

export default new foodRecipesService();
