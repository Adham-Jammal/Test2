import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { ShopDto } from '../services/shops/dto/shopDto';
import shopsService from '../services/shops/shopsService';
import { CreateOrUpdateShopDto } from '../services/shops/dto/createShopDto';

class ShopStore extends StoreBase {
  @observable shops: Array<ShopDto> = [];

  @observable loadingShops = true;

  @observable isSubmittingShop = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable shopModel?: ShopDto = undefined;

  @observable isGettingShopData = false;

  @observable keyword?: string = undefined;

  @observable shopFilter?: number = undefined;

  @observable isActiveFilter?: boolean = undefined;

  @action
  async getShops() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await shopsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          isActive: this.isActiveFilter,
          keyword: this.keyword,
        });
        this.shops = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingShops = true;
      },
      () => {
        this.loadingShops = false;
      }
    );
  }

  @action
  async createShop(input: CreateOrUpdateShopDto) {
    await this.wrapExecutionAsync(
      async () => {
        await shopsService.createShop(input);
        await this.getShops();
        notifySuccess();
      },
      () => {
        this.isSubmittingShop = true;
      },
      () => {
        this.isSubmittingShop = false;
      }
    );
  }

  @action
  async updateShop(input: CreateOrUpdateShopDto) {
    await this.wrapExecutionAsync(
      async () => {
        await shopsService.updateShop(input);
        await this.getShops();
        notifySuccess();
      },
      () => {
        this.isSubmittingShop = true;
      },
      () => {
        this.isSubmittingShop = false;
      }
    );
  }

  @action
  async getShop(input: EntityDto) {
    const shop = this.shops.find((c) => c.id === input.id);
    if (shop !== undefined) {
      this.shopModel = {
        id: shop.id,
        email: shop.email,
        ownerCountryCode: shop.ownerCountryCode,
        ownerPhoneNumber: shop.ownerPhoneNumber,
        productsCount: shop.productsCount,
        ordersCount: shop.ordersCount,
        isActive: shop.isActive,
        city: shop.city,
        arCoverUrl: shop.arCoverUrl,
        arDescription: shop.arDescription,
        arLogoUrl: shop.arLogoUrl,
        categories: shop.categories,
        enCoverUrl: shop.enCoverUrl,
        enDescription: shop.enDescription,
        enLogoUrl: shop.enLogoUrl,
        arName: shop.arName,
        manager: shop.manager,
        managerEmail: shop.managerEmail,
        enName: shop.enName,
        payments: shop.payments,
        code: shop.code,
        balance: shop.balance,
        banks: shop.banks,
        coverUrl: shop.coverUrl,
        description: shop.description,
        expectedMonthlySales: shop.expectedMonthlySales,
        followersCount: shop.followersCount,
        latitude: shop.latitude,
        logoUrl: shop.logoUrl,
        longitude: shop.longitude,
        minOrderHours: shop.minOrderHours,
        minOrderPrice: shop.minOrderPrice,
        name: shop.name,
        rate: shop.rate,
        ratings: shop.ratings,
        reasonCreatingShop: shop.reasonCreatingShop,
        reviews: shop.reviews,
        shopBundles: shop.shopBundles,
        type: shop.type,
        ownerEmail: shop.ownerEmail,
        ownerName: shop.ownerName,
      };
    }
  }

  @action
  async getShopFromAPI(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        const result = await shopsService.getShop(input);
        this.shopModel = result;
      },
      () => {
        this.isGettingShopData = true;
      },
      () => {
        this.isGettingShopData = false;
      }
    );
  }

  @action
  async shopActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await shopsService.shopActivation(input);
        //  await this.getShops();
        notifySuccess();
      },
      () => {
        this.loadingShops = true;
      },
      () => {
        this.loadingShops = false;
      }
    );
  }

  @action
  async shopDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await shopsService.shopDeactivation(input);
        //  await this.getShops();
        notifySuccess();
      },
      () => {
        this.loadingShops = true;
      },
      () => {
        this.loadingShops = false;
      }
    );
  }

  @action
  async deleteShop(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await shopsService.deleteShop(input);
        await this.getShops();
        notifySuccess();
      },
      () => {
        this.loadingShops = true;
      },
      () => {
        this.loadingShops = false;
      }
    );
  }
}

export default ShopStore;
