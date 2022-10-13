/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { FoodCategoryDto } from './dto/foodCategoryDto';
import { CreateFoodCategoryDto } from './dto/createFoodCategoryDto';
import { UpdateFoodCategoryDto } from './dto/updateFoodCategoryDto';
import { EntityDto } from '../dto/entityDto';
import { FoodCategoryPagedFilterRequest } from './dto/foodCategoryPagedFilterRequest';
import { LiteEntityDto } from '../dto/liteEntityDto';

class FoodCategoriesService {
  public async getAll(
    input: FoodCategoryPagedFilterRequest
  ): Promise<PagedResultDto<FoodCategoryDto>> {
    const result = await http.get('api/services/app/FoodCategory/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        isActive: input.isActive,
        keyword: input.keyword,
        advancedSearchKeyword: input.advancedSearchKeyword,
        Sorting: input.sorting,
      },
    });
    return result.data.result;
  }

  public async getAllLite(
    input: FoodCategoryPagedFilterRequest
  ): Promise<PagedResultDto<LiteEntityDto>> {
    const result = await http.get('api/services/app/FoodCategory/GetAllLite', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        isActive: input.isActive,
        keyword: input.keyword,
        advancedSearchKeyword: input.advancedSearchKeyword,
        Sorting: input.sorting,
      },
    });
    return result.data.result;
  }

  public async getFoodCategory(input: EntityDto): Promise<FoodCategoryDto> {
    const result = await http.get('api/services/app/FoodCategory/Get', {
      params: { id: input.id },
    });
    return result.data.result;
  }

  public async createFoodCategory(input: CreateFoodCategoryDto): Promise<FoodCategoryDto> {
    const result = await http.post('api/services/app/FoodCategory/Create', input);
    return result.data;
  }

  public async updateFoodCategory(input: UpdateFoodCategoryDto): Promise<FoodCategoryDto> {
    const result = await http.put('api/services/app/FoodCategory/Update', input);
    return result.data;
  }

  public async foodCategoryDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/FoodCategory/DeActivate', input);
    return result.data;
  }

  public async foodCategoryActivation(input: EntityDto) {
    const result = await http.put('api/services/app/FoodCategory/Activate', input);
    return result.data;
  }
}

export default new FoodCategoriesService();
