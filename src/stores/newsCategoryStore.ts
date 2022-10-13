import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { NewsCategoryDto } from '../services/newsCategory/dto/newsCategoryDto';
import newsCategoriesService from '../services/newsCategory/newsCategoriesService';
import { notifySuccess } from '../lib/notifications';
import { CreateNewsCategoryDto } from '../services/newsCategory/dto/createNewsCategoryDto';
import { UpdateNewsCategoryDto } from '../services/newsCategory/dto/updateNewsCategoryDto';
import { EntityDto } from '../services/dto/entityDto';

class NewsCategoryStore extends StoreBase {
  @observable newsCategories: Array<NewsCategoryDto> = [];

  @observable loadingCategories = true;

  @observable isSubmittingCategory = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable categoryModel?: NewsCategoryDto = undefined;

  @observable statusFilter?: number = undefined;

  @observable keyword?: string = undefined;

  @observable isSortingItems = false;

  @action
  async getNewsCategories() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await newsCategoriesService.getAll();
        this.newsCategories = result.items;
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
  async createNewsCategory(input: CreateNewsCategoryDto) {
    await this.wrapExecutionAsync(
      async () => {
        await newsCategoriesService.createNewsCategory(input);
        await this.getNewsCategories();
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
  async updateNewsCategory(input: UpdateNewsCategoryDto) {
    await this.wrapExecutionAsync(
      async () => {
        await newsCategoriesService.updateNewsCategory(input);
        await this.getNewsCategories();
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
  async getNewsCategory(input: EntityDto) {
    const category = await newsCategoriesService.getNewsCategory(input);
    if (category !== undefined) {
      this.categoryModel = {
        id: category.id,
        isActive: category.isActive,
        arName: category.arName,
        enName: category.enName,
        name: category.name,
        createdBy: category.createdBy,
        creationTime: category.creationTime,
        newsCount: category.newsCount,
        imageUrl: category.imageUrl,
      };
    }
  }

  @action
  async newsCategoryActivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await newsCategoriesService.newsCategoryActivation(input);
        await this.getNewsCategories();
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
  async newsCategoryDeactivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await newsCategoriesService.newsCategoryDeactivation(input);
        await this.getNewsCategories();
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

export default NewsCategoryStore;
