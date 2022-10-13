import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { OfferDto } from '../services/offers/dto/OfferDto';
import OffersService from '../services/offers/OffersService';
import { CreateOfferDto } from '../services/offers/dto/createOfferDto';
import { UpdateOfferDto } from '../services/offers/dto/updateOfferDto';

class OffersStore extends StoreBase {
  @observable offers: Array<OfferDto> = [];
  @observable loadingOffers = true;
  @observable isSubmittingOffer = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable totalCount: number = 0;
  @observable offerModel?: OfferDto = undefined;
  @observable keyword?: string = undefined;
  @observable type?: number = undefined;

  @action
  async getAllOffers() {
    await this.wrapExecutionAsync(
      async () => {
        let result = await OffersService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          type: this.type,
        });
        this.offers = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingOffers = true;
      },
      () => {
        this.loadingOffers = false;
      }
    );
  }

  @action
  async createOffer(input: CreateOfferDto) {
    await this.wrapExecutionAsync(
      async () => {
        await OffersService.createOffer(input);
        await this.getAllOffers();
        notifySuccess();
      },
      () => {
        this.isSubmittingOffer = true;
      },
      () => {
        this.isSubmittingOffer = false;
      }
    );
  }

  @action
  async updateOffer(input: UpdateOfferDto) {
    await this.wrapExecutionAsync(
      async () => {
        await OffersService.updateOffer(input);
        await this.getAllOffers();
        notifySuccess();
      },
      () => {
        this.isSubmittingOffer = true;
      },
      () => {
        this.isSubmittingOffer = false;
      }
    );
  }

  @action
  async getOffer(input: EntityDto) {
    let offer = this.offers.find((c) => c.id === input.id);
    if (offer !== undefined) {
      this.offerModel = {
        id: offer.id,
        creationTime: offer.creationTime,
        endDate: offer.endDate,
        orderMinValue: offer.orderMinValue,
        percentage: offer.percentage,
        products: offer.products,
        startDate: offer.startDate,
        type: offer.type,
        isActive: offer.isActive,
      };
    }
  }
  @action
  async offerDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await OffersService.offerDeactivation(input);
        //  await this.getShops();
        notifySuccess();
      },
      () => {
        this.loadingOffers = true;
      },
      () => {
        this.loadingOffers = false;
      }
    );
  }
  @action
  async offerAactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await OffersService.offerActivation(input);
        //  await this.getShops();
        notifySuccess();
      },
      () => {
        this.loadingOffers = true;
      },
      () => {
        this.loadingOffers = false;
      }
    );
  }
  @action
  async deleteOffer(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await OffersService.deleteOffer(input);
        await this.getAllOffers();
        notifySuccess();
      },
      () => {
        this.loadingOffers = true;
      },
      () => {
        this.loadingOffers = false;
      }
    );
  }
}

export default OffersStore;
