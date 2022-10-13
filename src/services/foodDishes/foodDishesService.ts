/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { FoodDishDto } from './dto/DishDto';
import { CreateFoodDishDto } from './dto/createDishDto';
import { UpdateFoodDishDto } from './dto/updateDishDto';
import { FoodDishesPagedFilterRequest } from './dto/foodDishesPagedFilterRequest';

class FoodDishesService {
  public async getAll(input: FoodDishesPagedFilterRequest): Promise<PagedResultDto<FoodDishDto>> {
    const result = await http.get('api/services/app/Dish/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        isActive: input.status,
        keyword: input.keyword,
        advancedSearchKeyword: input.advancedSearchKeyword,
        Sorting: input.sorting,
      },
    });
    return result.data.result;
  }

  public async getFoodDish(input: EntityDto): Promise<FoodDishDto> {
    const result = await http.get('api/services/app/Dish/Get', {
      params: { id: input.id },
    });
    return result.data.result;
  }

  public async createFoodDish(input: CreateFoodDishDto): Promise<FoodDishDto> {
    const result = await http.post('api/services/app/Dish/Create', input);
    return result.data;
  }

  public async updateFoodDish(input: UpdateFoodDishDto): Promise<FoodDishDto> {
    const result = await http.put('api/services/app/Dish/Update', input);
    return result.data;
  }

  public async foodDishDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/Dish/DeActivate', input);
    return result.data;
  }

  public async foodDishActivation(input: EntityDto) {
    const result = await http.put('api/services/app/Dish/Activate', input);
    return result.data;
  }
}

export default new FoodDishesService();
