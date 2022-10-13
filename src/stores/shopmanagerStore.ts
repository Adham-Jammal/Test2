import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import {
  RegisterShopManagerDto,
  ShopManagerDto,
} from '../services/shopManagers/dto/shopManagerDto';
import shopManagersService from '../services/shopManagers/shopManagersService';
import shopsService from '../services/shops/shopsService';

class ShopManagerStore extends StoreBase {
  @observable shopManagers: Array<ShopManagerDto> = [];
  @observable loadingShopManagers = true;
  @observable ShopManagersForExport: Array<ShopManagerDto> = [];
  @observable loadingShopManagersForExport = true;
  @observable maxResultCount: number = 1000;
  @observable isSubmittingShopManager = false;
  @observable skipCount: number = 0;
  @observable totalCount: number = 0;
  @observable shopManagerModel?: ShopManagerDto = undefined;
  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;

  @action
  async getShopManagersForExport() {
    await this.wrapExecutionAsync(
      async () => {
        let result = await shopManagersService.getAll({
          skipCount: 0,
          maxResultCount: 100000000,
          keyword: this.keyword,
          isActive: this.isActiveFilter,
        });
        this.ShopManagersForExport = result.items;
      },
      () => {
        this.loadingShopManagersForExport = true;
      },
      () => {
        this.loadingShopManagersForExport = false;
      }
    );
  }

  @action
  async getShopManagers() {
    await this.wrapExecutionAsync(
      async () => {
        let result = await shopManagersService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          isActive: this.isActiveFilter,
          keyword: this.keyword,
        });

        this.shopManagers = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingShopManagers = true;
      },
      () => {
        this.loadingShopManagers = false;
      }
    );
  }

  @action
  async getShopManager(input: EntityDto) {
    let shopManager = this.shopManagers.find((c) => c.id === input.id);
    if (shopManager !== undefined) {
      this.shopManagerModel = {
        id: shopManager.id,
        countryCode: shopManager.countryCode,
        imageUrl: shopManager.imageUrl,
        ownerName: shopManager.ownerName,
        ownerSurname: shopManager.ownerSurname,
        shopName: shopManager.shopName,
        status: shopManager.status,
        shopId: shopManager.shopId,
        emailAddress: shopManager.emailAddress,
        categories: shopManager.categories,
        city: shopManager.city,
        joinDate: shopManager.joinDate,
        ordersCount: shopManager.ordersCount,
        phoneNumber: shopManager.phoneNumber,
        productsCount: shopManager.productsCount,
        totalIncome: shopManager.totalIncome,
        lastLoginDate: shopManager.lastLoginDate,
        shop: shopManager.shop,
      };
    }
  }

  @action
  async shopManagerActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await shopsService.shopActivation(input);
        await this.getShopManagers();
        notifySuccess();
      },
      () => {
        this.loadingShopManagers = true;
      },
      () => {
        this.loadingShopManagers = false;
      }
    );
  }
  @action
  async registerShopManager(input: RegisterShopManagerDto) {
    await this.wrapExecutionAsync(
      async () => {
        await shopManagersService.registerShopManager(input);
        // notifySuccess();
      },
      () => {
        this.isSubmittingShopManager = true;
      },
      () => {
        this.isSubmittingShopManager = false;
      }
    );
  }

  @action
  async shopManagerDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await shopsService.shopDeactivation(input);
        await this.getShopManagers();
        notifySuccess();
      },
      () => {
        this.loadingShopManagers = true;
      },
      () => {
        this.loadingShopManagers = false;
      }
    );
  }
}

export default ShopManagerStore;
