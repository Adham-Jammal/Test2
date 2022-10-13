import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { ClassificationDto } from '../services/classifications/dto/classificationDto';
import classificationsService from '../services/classifications/classificationsService';
import { CreateClassificationDto } from '../services/classifications/dto/createClassificationDto';
import { UpdateClassificationDto } from '../services/classifications/dto/updateClassificationDto';

class ClassificationStore extends StoreBase {
  @observable classifications: Array<ClassificationDto> = [];
  @observable loadingClassifications = true;
  @observable isSubmittingClassification = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable classificationModel?: ClassificationDto = undefined;
  @observable categoryId: number = 0;
  @observable totalCount: number = 0;
  @observable keyword?: string = undefined;

  @observable categoryIdFilter?: number = undefined;
  @observable statusFilter?: boolean = undefined;

  @action
  async getClassifications(categoryId?: number) {
    await this.wrapExecutionAsync(
      async () => {
        let result = await classificationsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          categoryId: categoryId !== undefined ? categoryId : this.categoryIdFilter,
          isActive: this.statusFilter,
          keyword: this.keyword,
        });
        this.classifications = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingClassifications = true;
      },
      () => {
        this.loadingClassifications = false;
      }
    );
  }

  @action
  async createClassification(input: CreateClassificationDto) {
    await this.wrapExecutionAsync(
      async () => {
        await classificationsService.createClassification(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingClassification = true;
      },
      () => {
        this.isSubmittingClassification = false;
      }
    );
  }

  @action
  async updateClassification(input: UpdateClassificationDto) {
    await this.wrapExecutionAsync(
      async () => {
        await classificationsService.updateClassification(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingClassification = true;
      },
      () => {
        this.isSubmittingClassification = false;
      }
    );
  }

  @action
  async getClassification(input: EntityDto) {
    let classification = this.classifications.find((c) => c.id === input.id);
    if (classification !== undefined) {
      this.classificationModel = {
        id: classification.id,
        ordersCount: classification.ordersCount,
        productsCount: classification.productsCount,
        imageUrl: classification.imageUrl,
        arName: classification.arName,
        enName: classification.enName,
        category: classification.category,
        isActive: classification.isActive,
        events: classification.events,
      };
    }
  }

  @action
  async classificationActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await classificationsService.classificationActivation(input);
        notifySuccess();
      },
      () => {
        this.loadingClassifications = true;
      },
      () => {
        this.loadingClassifications = false;
      }
    );
  }
  @action
  async classificationDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await classificationsService.classificationDeactivation(input);
        notifySuccess();
      },
      () => {
        this.loadingClassifications = true;
      },
      () => {
        this.loadingClassifications = false;
      }
    );
  }
}

export default ClassificationStore;
