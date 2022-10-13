import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { ProductDto, UpdateProductDto, CreateProductDto } from '../services/products/dto';
import productsService from '../services/products/productsService';
import { notifySuccess } from '../lib/notifications';

class ProductStore extends StoreBase {
  @observable products: Array<ProductDto> = [];

  @observable featuredProducts: Array<ProductDto> = [];

  @observable loadingProducts = true;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable productModel?: ProductDto = undefined;

  @observable isSortingItems = false;

  @observable isGettingData = false;

  @observable keyword?: string = undefined;

  @observable sorting?: string = undefined;

  @observable shopFilter?: number = undefined;

  @observable categoryFilter?: number = undefined;

  @observable classificationFilter?: number = undefined;

  @observable type?: number = undefined;

  @observable isActiveFilter?: boolean = undefined;

  @observable featuredFilter?: boolean = undefined;

  @observable hasOfferFilter?: boolean = undefined;
  @observable myProducts?: boolean = undefined;

  @observable isSubmittingProduct = false;

  @action
  async getProducts() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await productsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          categoryId: this.categoryFilter,
          classificationId: this.classificationFilter,
          shopId: this.shopFilter,
          isActive: this.isActiveFilter,
          OnlyFeatured: this.featuredFilter,
          HasOffer: this.hasOfferFilter,
          Sorting: this.sorting,
          myProducts: this.myProducts,
        });
        this.products = result.items;
        this.featuredProducts = this.products.filter((p) => p.isFeatured);
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingProducts = true;
      },
      () => {
        this.loadingProducts = false;
      }
    );
  }

  @action
  async getProduct(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        const product = await productsService.getProduct(input);
        if (product !== undefined) {
          this.productModel = product;
        }
      },
      () => {
        this.isGettingData = true;
      },
      () => {
        this.isGettingData = false;
      }
    );
  }

  @action
  async productActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await productsService.productActivation(input);
        await this.getProducts();
        notifySuccess();
      },
      () => {
        this.loadingProducts = true;
      },
      () => {
        this.loadingProducts = false;
      }
    );
  }

  @action
  async createProduct(input: CreateProductDto) {
    await this.wrapExecutionAsync(
      async () => {
        await productsService.createProduct(input);
        await this.getProducts();
        notifySuccess();
      },
      () => {
        this.isSubmittingProduct = true;
      },
      () => {
        this.isSubmittingProduct = false;
      }
    );
  }

  @action
  async updateProduct(input: UpdateProductDto) {
    await this.wrapExecutionAsync(
      async () => {
        await productsService.updateProduct(input);
        await this.getProducts();
        notifySuccess();
      },
      () => {
        this.isSubmittingProduct = true;
      },
      () => {
        this.isSubmittingProduct = false;
      }
    );
  }

  @action
  async productDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await productsService.productDeactivation(input);
        await this.getProducts();
        notifySuccess();
      },
      () => {
        this.loadingProducts = true;
      },
      () => {
        this.loadingProducts = false;
      }
    );
  }

  @action
  async productFeature(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await productsService.productFeature(input);
        await this.getProducts();
        notifySuccess();
      },
      () => {
        this.loadingProducts = true;
      },
      () => {
        this.loadingProducts = false;
      }
    );
  }

  @action
  async productUnFeature(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await productsService.productUnFeature(input);
        await this.getProducts();
        notifySuccess();
      },
      () => {
        this.loadingProducts = true;
      },
      () => {
        this.loadingProducts = false;
      }
    );
  }

  @action
  async productAddToFavourite(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await productsService.productAddToFavorite(input);
        await this.getProducts();
        notifySuccess();
      },
      () => {
        this.loadingProducts = true;
      },
      () => {
        this.loadingProducts = false;
      }
    );
  }

  @action
  async productRemoveFromFavourite(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await productsService.productRemoveFromFavorite(input);
        await this.getProducts();
        notifySuccess();
      },
      () => {
        this.loadingProducts = true;
      },
      () => {
        this.loadingProducts = false;
      }
    );
  }
}

export default ProductStore;
