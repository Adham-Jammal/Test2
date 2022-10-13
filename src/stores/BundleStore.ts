import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { BundleDto, CreateOrUpdateBundleDto } from '../services/bundles/dto';
import bundlesService from '../services/bundles/bundlesService';

class BundleStore extends StoreBase {
  @observable bundles: Array<BundleDto> = [];

  @observable loadingBundles = true;

  @observable isSubmittingBundle = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable keyword?: string = undefined;

  @observable totalCount = 0;

  @observable sorting?: string = undefined;

  @observable bundleModel?: BundleDto = undefined;

  @observable IsActive?: boolean = undefined;

  @action
  async getBundles() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await bundlesService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          IsActive: this.IsActive,
          Sorting: this.sorting,
          key: this.keyword,
        });
        this.bundles = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingBundles = true;
      },
      () => {
        this.loadingBundles = false;
      }
    );
  }

  @action
  async createBundle(input: CreateOrUpdateBundleDto) {
    await this.wrapExecutionAsync(
      async () => {
        await bundlesService.createBundle(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingBundle = true;
      },
      () => {
        this.isSubmittingBundle = false;
      }
    );
  }

  @action
  async updateBundle(input: CreateOrUpdateBundleDto) {
    await this.wrapExecutionAsync(
      async () => {
        await bundlesService.updateBundle(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingBundle = true;
      },
      () => {
        this.isSubmittingBundle = false;
      }
    );
  }

  @action
  async getBundleById(input: EntityDto) {
    const bundle = await bundlesService.getBundleById(input);
    if (bundle !== undefined) {
      this.bundleModel = bundle;
    }
  }

  @action
  async bundleActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await bundlesService.bundleActivation(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingBundle = true;
      },
      () => {
        this.isSubmittingBundle = false;
      }
    );
  }

  @action
  async bundleDeActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await bundlesService.bundleDeactivation(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingBundle = true;
      },
      () => {
        this.isSubmittingBundle = false;
      }
    );
  }
}

export default BundleStore;
