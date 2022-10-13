import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { SliderImageDto } from '../services/sliderImages/dto/sliderImageDto';
import sliderImagesService from '../services/sliderImages/sliderImagesService';
import { CreateSliderImageDto } from '../services/sliderImages/dto/createSliderImageDto';
import { UpdateSliderImageDto } from '../services/sliderImages/dto/updateSliderImageDto';

class SliderImageStore extends StoreBase {
  @observable sliderImages: Array<SliderImageDto> = [];
  @observable loadingSliderImages = true;
  @observable isSubmittingSliderImage = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable totalCount: number = 0;
  @observable SliderImageModel?: SliderImageDto = undefined;
  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;
  @observable shopId?: number = undefined;
  @observable myPromotions?: boolean = undefined;

  @action
  async getSliderImages() {
    await this.wrapExecutionAsync(
      async () => {
        let result = await sliderImagesService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          isActive: this.isActiveFilter,
          shopId: this.shopId,
          myPromotions: this.myPromotions,
        });
        this.sliderImages = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingSliderImages = true;
      },
      () => {
        this.loadingSliderImages = false;
      }
    );
  }

  @action
  async createSliderImage(input: CreateSliderImageDto) {
    await this.wrapExecutionAsync(
      async () => {
        await sliderImagesService.createSliderImage(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingSliderImage = true;
      },
      () => {
        this.isSubmittingSliderImage = false;
      }
    );
  }

  @action
  async updateSliderImage(input: UpdateSliderImageDto) {
    await this.wrapExecutionAsync(
      async () => {
        await sliderImagesService.updateSliderImage(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingSliderImage = true;
      },
      () => {
        this.isSubmittingSliderImage = false;
      }
    );
  }

  @action
  async getSliderImage(input: EntityDto) {
    let sliderImage = this.sliderImages.find((c) => c.id === input.id);
    if (sliderImage !== undefined) {
      this.SliderImageModel = {
        id: sliderImage.id,
        endDate: sliderImage.endDate,
        imageUrl: sliderImage.imageUrl,
        isActive: sliderImage.isActive,
        shopId: sliderImage.shopId,
        startDate: sliderImage.startDate,
      };
    }
  }

  @action
  async deleteSliderImage(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await sliderImagesService.deleteSliderImage(input);
        notifySuccess();
      },
      () => {
        this.loadingSliderImages = true;
      },
      () => {
        this.loadingSliderImages = false;
      }
    );
  }

  @action
  async sliderImageActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await sliderImagesService.sliderImageActivation(input);
        notifySuccess();
      },
      () => {
        this.loadingSliderImages = true;
      },
      () => {
        this.loadingSliderImages = false;
      }
    );
  }
  @action
  async sliderImageDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await sliderImagesService.sliderImageDeActivation(input);
        notifySuccess();
      },
      () => {
        this.loadingSliderImages = true;
      },
      () => {
        this.loadingSliderImages = false;
      }
    );
  }
}

export default SliderImageStore;
