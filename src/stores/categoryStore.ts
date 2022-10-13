import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { CategoryDto } from '../services/categories/dto/categoryDto';
import categoriesService from '../services/categories/categoriesService';
import { CreateCategoryDto } from '../services/categories/dto/createCategoryDto';
import { UpdateCategoryDto } from '../services/categories/dto/updateCategoryDto';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { EventOrderDto } from '../services/events/dto/updateEventOrdersDto';

class CategoryStore extends StoreBase {
  @observable categories: Array<CategoryDto> = [];
  @observable loadingCategories = true;
  @observable isSubmittingCategory = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable totalCount: number = 0;
  @observable categoryModel?: CategoryDto = undefined;
  @observable statusFilter?: boolean = undefined;
  @observable keyword?: string = undefined;
  @observable isSortingItems: boolean = false;

  @action
  async getCategories() {
    await this.wrapExecutionAsync(
      async () => {
        let result = await categoriesService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          isActive: this.statusFilter,
          keyword: this.keyword,
        });
        this.categories = result.items;
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
  async updateCategoryOrders(input: EventOrderDto[]) {
    await this.wrapExecutionAsync(
      async () => {
        await categoriesService.updateCategoryOrders(input);
        notifySuccess();
      },
      () => {
        this.isSortingItems = true;
      },
      () => {
        this.isSortingItems = false;
      }
    );
  }

  @action
  async createCategory(input: CreateCategoryDto) {
    await this.wrapExecutionAsync(
      async () => {
        await categoriesService.createCategory(input);
        await this.getCategories();
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
  async updateCategory(input: UpdateCategoryDto) {
    await this.wrapExecutionAsync(
      async () => {
        await categoriesService.updateCategory(input);
        await this.getCategories();
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
  async getCategory(input: EntityDto) {
    let category = await categoriesService.getCategory(input);
    if (category !== undefined) {
      this.categoryModel = {
        ordersCount: category.ordersCount,
        productsCount: category.productsCount,
        id: category.id,
        imageUrl: category.imageUrl,
        isActive: category.isActive,
        arName: category.arName,
        enName: category.enName,
        classifications: category.classifications,
        name: category.name,
        order: category.order,
        products: category.products,
        shops: category.shops,
      };
    }
  }

  @action
  async categoryActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await categoriesService.categoryActivation(input);
        await this.getCategories();
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
  async categoryDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await categoriesService.categoryDeactivation(input);
        await this.getCategories();
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

export default CategoryStore;
