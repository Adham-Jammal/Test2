import { action, observable } from 'mobx';
import { notifySuccess } from '../lib/notifications';
import { EntityDto } from '../services/dto/entityDto';
import type { CreateFoodDishDto } from '../services/foodDishes/dto/createDishDto';
import type { FoodDishDto } from '../services/foodDishes/dto/DishDto';
import type { UpdateFoodDishDto } from '../services/foodDishes/dto/updateDishDto';
import foodDishesService from '../services/foodDishes/foodDishesService';
import { GetCurrentLoginInformations } from '../services/session/dto/getCurrentLoginInformations';
import StoreBase from './storeBase';

class FoodDishesStore extends StoreBase {
  @observable currentLogin: GetCurrentLoginInformations = new GetCurrentLoginInformations();

  @observable foodDishes: Array<FoodDishDto> = [];

  @observable loadingFoodDishes = true;

  @observable isSubmittingFoodDishes = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable foodDishesModel?: FoodDishDto = undefined;

  @observable keyword?: string = undefined;

  @observable advancedSearchKeyword?: string = undefined;

  @observable statusFilter?: number = undefined;

  @observable sorting?: string = undefined;

  @action
  async getAllFoodDishes() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await foodDishesService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          advancedSearchKeyword: this.advancedSearchKeyword,
          status: this.statusFilter,
          sorting: this.sorting,
        });
        this.foodDishes = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingFoodDishes = true;
      },
      () => {
        this.loadingFoodDishes = false;
      }
    );
  }

  @action
  async createFoodDish(input: CreateFoodDishDto) {
    await this.wrapExecutionAsync(
      async () => {
        await foodDishesService.createFoodDish(input);
        await this.getAllFoodDishes();
        notifySuccess();
      },
      () => {
        this.isSubmittingFoodDishes = true;
      },
      () => {
        this.isSubmittingFoodDishes = false;
      }
    );
  }

  @action
  async updateFoodDish(input: UpdateFoodDishDto) {
    await this.wrapExecutionAsync(
      async () => {
        await foodDishesService.updateFoodDish(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingFoodDishes = true;
      },
      () => {
        this.isSubmittingFoodDishes = false;
      }
    );
  }

  @action
  async getFoodDish(input: EntityDto) {
    const dish = await foodDishesService.getFoodDish(input);
    if (dish !== undefined) {
      this.foodDishesModel = {
        id: dish.id,
        foodCategoryId: dish.foodCategoryId,
        foodCategoryName: dish.foodCategoryName,
        imageUrl: dish.imageUrl,
        arName: dish.arName,
        enName: dish.enName,
        name: dish.name,
        createdBy: dish.createdBy,
        creationTime: dish.creationTime,
        arAbout: dish.arAbout,
        enAbout: dish.enAbout,
        about: dish.about,
        creatorUserId: dish.creatorUserId,
        nutritions: dish.nutritions,
        standardServingAmount: dish.standardServingAmount,
        isActive: dish.isActive,
        amountOfCalories: dish.amountOfCalories,
      };
    }
  }

  @action
  async foodDishActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await foodDishesService.foodDishActivation(input);
        await this.getAllFoodDishes();
        notifySuccess();
      },
      () => {
        this.loadingFoodDishes = true;
      },
      () => {
        this.loadingFoodDishes = false;
      }
    );
  }

  @action
  async foodDishDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await foodDishesService.foodDishDeactivation(input);
        await this.getAllFoodDishes();
        notifySuccess();
      },
      () => {
        this.loadingFoodDishes = true;
      },
      () => {
        this.loadingFoodDishes = false;
      }
    );
  }
}

export default FoodDishesStore;
