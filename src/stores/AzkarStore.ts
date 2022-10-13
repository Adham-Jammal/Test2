import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import AzkarService from '../services/azkar/azkarService';
import { AzkarDto, CreateOrUpdateAzkarDto } from '../services/azkar/dto';

class AzkarStore extends StoreBase {
  @observable azkar: Array<AzkarDto> = [];

  @observable loadingAzkar = true;

  @observable isSubmittingAzkar = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable statusFilter?: boolean = undefined;

  @observable categoryFilter?: number = undefined;

  @observable minCreationTime?: string = undefined;

  @observable maxCreationTime?: string = undefined;

  @observable sorting?: string = undefined;


  @observable azkarModel?: AzkarDto = undefined;

  @observable keyword?: string = undefined;

  @observable IsActive?: boolean = undefined;

  @action
  async getAzkar() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await AzkarService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          IsActive: this.IsActive,
          CategoryId: this.categoryFilter,
          MinCreationTime: this.minCreationTime,
          MaxCreationTime: this.maxCreationTime,
          Sorting:this.sorting
        });
        this.azkar = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingAzkar = true;
      },
      () => {
        this.loadingAzkar = false;
      }
    );
  }

  @action
  async createAzkar(input: CreateOrUpdateAzkarDto) {
    await this.wrapExecutionAsync(
      async () => {
        await AzkarService.createAzkar(input);
        await this.getAzkar();
        notifySuccess();
      },
      () => {
        this.isSubmittingAzkar = true;
      },
      () => {
        this.isSubmittingAzkar = false;
      }
    );
  }

  @action
  async updateAzkar(input: CreateOrUpdateAzkarDto) {
    await this.wrapExecutionAsync(
      async () => {
        await AzkarService.updateAzkar(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingAzkar = true;
      },
      () => {
        this.isSubmittingAzkar = false;
      }
    );
  }

  @action
  async getAzkarById(input: EntityDto) {
    const azkar = await AzkarService.getAzkarById(input);
    if (azkar !== undefined) {
      this.azkarModel = azkar;
    }
  }

  @action
  async AzkarActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await AzkarService.azkarActivation(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingAzkar = true;
      },
      () => {
        this.isSubmittingAzkar = false;
      }
    );
  }

  @action
  async AzkarDeActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await AzkarService.azkarDeactivation(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingAzkar = true;
      },
      () => {
        this.isSubmittingAzkar = false;
      }
    );
  }

  @action
  async AzkarDelete(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await AzkarService.azkarDelete(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingAzkar = true;
      },
      () => {
        this.isSubmittingAzkar = false;
      }
    );
  }
}

export default AzkarStore;
