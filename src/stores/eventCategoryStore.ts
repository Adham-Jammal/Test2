import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import EventCategoryService from '../services/eventCategory/eventCategoriesService';
import { EventCategoryDto, CreateOrUpdateEventCategoryDto } from '../services/eventCategory/dto';

class EventCategoryStore extends StoreBase {
  @observable eventCatagories: EventCategoryDto[] = [];

  @observable categoryData?: EventCategoryDto = undefined;

  @observable loadingCatagories = true;

  @observable isSubmittingCategory = false;

  @observable isGettingCategoryData = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable isActiveFilter?: boolean = undefined;

  @observable keyword?: string = undefined;

  @action
  async getEventCatagories(): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        const result = await EventCategoryService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          isActive: this.isActiveFilter,
        });
        this.eventCatagories = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingCatagories = true;
      },
      () => {
        this.loadingCatagories = false;
      }
    );
  }

  @action
  async createEventCategory(input: CreateOrUpdateEventCategoryDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await EventCategoryService.createEventCategory(input);
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
  async updateEventCategory(input: CreateOrUpdateEventCategoryDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await EventCategoryService.updateEventCategory(input);
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
  async getEventCategory(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        const result = await EventCategoryService.getEventCategory(input);
        this.categoryData = result;
      },
      () => {
        this.isGettingCategoryData = true;
      },
      () => {
        this.isGettingCategoryData = false;
      }
    );
  }

  @action
  async categoryActivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await EventCategoryService.eventCategoryActivation(input);
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
  async categoryDeactivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await EventCategoryService.eventCategoryDeactivation(input);
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
}

export default EventCategoryStore;
