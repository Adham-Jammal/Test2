import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { notifySuccess } from '../lib/notifications';
import { EntityDto } from '../services/dto/entityDto';
import type { FoodCategoryDto } from '../services/foodCategory/dto/foodCategoryDto';
import foodCatogryService from '../services/foodCategory/foodCatogryService';
import { CreateFoodCategoryDto } from '../services/foodCategory/dto/createFoodCategoryDto';
import { UpdateFoodCategoryDto } from '../services/foodCategory/dto/updateFoodCategoryDto';

class FoodCategoryStore extends StoreBase {
  @observable foodCategories: Array<FoodCategoryDto> = [];

  @observable loadingCategories = true;

  @observable isSubmittingCategory = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable categoryModel?: FoodCategoryDto = undefined;

  @observable statusFilter?: boolean = undefined;

  @observable keyword?: string = undefined;

  @observable isSortingItems = false;

  @observable advancedSearchKeyword?: string = undefined;

  @observable sorting?: string = undefined;

  @action
  async getFoodCategories(activeOnly?: boolean) {
    await this.wrapExecutionAsync(
      async () => {
        const result = await foodCatogryService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          advancedSearchKeyword: this.advancedSearchKeyword,
          isActive: activeOnly !== undefined ? activeOnly : this.statusFilter,
          sorting: this.sorting,
        });
        this.foodCategories = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingCategories = true;
      },
      () => {
        this.loadingCategories = false;
      }
    );
  }

  @action
  async createFoodCategory(input: CreateFoodCategoryDto) {
    await this.wrapExecutionAsync(
      async () => {
        await foodCatogryService.createFoodCategory(input);
        await this.getFoodCategories();
        notifySuccess();
      },
      () => {
        this.isSubmittingCategory = true;
      },
      () => {
        this.isSubmittingCategory = false;
      }
    );
  }

  @action
  async updateFoodCategory(input: UpdateFoodCategoryDto) {
    await this.wrapExecutionAsync(
      async () => {
        await foodCatogryService.updateFoodCategory(input);
        await this.getFoodCategories();
        notifySuccess();
      },
      () => {
        this.isSubmittingCategory = true;
      },
      () => {
        this.isSubmittingCategory = false;
      }
    );
  }

  @action
  async getFoodCategory(input: EntityDto) {
    const category = await foodCatogryService.getFoodCategory(input);
    if (category !== undefined) {
      this.categoryModel = {
        id: category.id,
        isActive: category.isActive,
        arTitle: category.arTitle,
        enTitle: category.enTitle,
        title: category.title,
        createdBy: category.createdBy,
        creatorUserId: category.creatorUserId,
        creationTime: category.creationTime,
        imageUrl: category.imageUrl,
      };
    }
  }

  @action
  async foodCategoryActivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await foodCatogryService.foodCategoryActivation(input);
        await this.getFoodCategories();
        notifySuccess();
      },
      () => {
        this.loadingCategories = true;
      },
      () => {
        this.loadingCategories = false;
      }
    );
  }

  @action
  async foodCategoryDeactivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await foodCatogryService.foodCategoryDeactivation(input);
        await this.getFoodCategories();
        notifySuccess();
      },
      () => {
        this.loadingCategories = true;
      },
      () => {
        this.loadingCategories = false;
      }
    );
  }
}

export default FoodCategoryStore;
