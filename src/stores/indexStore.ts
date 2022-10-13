import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { IndexDto } from '../services/indexes/dto/IndexDto';
import indexesService from '../services/indexes/indexesService';
import { CreateIndexDto } from '../services/indexes/dto/createIndexDto';
import { UpdateIndexDto } from '../services/indexes/dto/updateIndexDto';

class IndexStore extends StoreBase {
  @observable indices: Array<IndexDto> = [];

  @observable loadingIndexes = true;

  @observable isSubmittingIndexes = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable indexModel?: IndexDto = undefined;

  @observable isActiveFilter?: boolean = undefined;

  @observable keyword?: string = undefined;

  @action
  async getAll(type: number): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        const result = await indexesService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          type,
          isActive: this.isActiveFilter,
        });
        this.indices = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingIndexes = true;
      },
      () => {
        this.loadingIndexes = false;
      }
    );
  }

  @action
  async createIndex(input: CreateIndexDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await indexesService.createIndex(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingIndexes = true;
      },
      () => {
        this.isSubmittingIndexes = false;
      }
    );
  }

  @action
  async updateIndex(input: UpdateIndexDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await indexesService.updateIndex(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingIndexes = true;
      },
      () => {
        this.isSubmittingIndexes = false;
      }
    );
  }

  @action
  async getIndex(input: EntityDto): Promise<void> {
    const indexItem = this.indices.find((c) => c.id === input.id);
    if (indexItem !== undefined) {
      this.indexModel = {
        id: indexItem.id,
        name: indexItem.name,
        isActive: indexItem.isActive,
        arName: indexItem.arName,
        enName: indexItem.enName,
        type: indexItem.type,
      };
    }
  }

  @action
  async indexActivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await indexesService.indexActivation(input);
        notifySuccess();
      },
      () => {
        this.loadingIndexes = true;
      },
      () => {
        this.loadingIndexes = false;
      }
    );
  }

  @action
  async indexDeactivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await indexesService.indexDeactivation(input);
        notifySuccess();
      },
      () => {
        this.loadingIndexes = true;
      },
      () => {
        this.loadingIndexes = false;
      }
    );
  }

  @action
  async indexDelete(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await indexesService.indexDelete(input);
        notifySuccess();
      },
      () => {
        this.loadingIndexes = true;
      },
      () => {
        this.loadingIndexes = false;
      }
    );
  }
}

export default IndexStore;
