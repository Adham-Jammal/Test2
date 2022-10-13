import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { CouponDto } from '../services/coupons/dto/couponDto';
import couponsService from '../services/coupons/couponsService';
import { CreateCouponDto } from '../services/coupons/dto/createCouponDto';
import { UpdateCouponDto } from '../services/coupons/dto/updateCouponDto';

class CouponStore extends StoreBase {
  @observable coupons: Array<CouponDto> = [];
  @observable loadingCoupons = true;
  @observable isSubmittingCoupon = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable totalCount: number = 0;
  @observable couponModel?: CouponDto = undefined;
  @observable classificationId?: number = undefined;
  @observable keyword?: string = undefined;
  @observable myCoupons?: boolean = undefined;
  @observable isFreeShipping?: boolean = undefined;
  @observable clientId?: number = undefined;
  @observable shopId?: number = undefined;

  @action
  async getCoupons() {
    await this.wrapExecutionAsync(
      async () => {
        let result = await couponsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          classificationId: this.classificationId,
          myCoupons: this.myCoupons,
          clientId: this.clientId,
          isFreeShipping: this.isFreeShipping,
          shopId: this.shopId,
        });
        this.coupons = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingCoupons = true;
      },
      () => {
        this.loadingCoupons = false;
      }
    );
  }

  @action
  async createCoupon(input: CreateCouponDto) {
    await this.wrapExecutionAsync(
      async () => {
        await couponsService.createCoupon(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingCoupon = true;
      },
      () => {
        this.isSubmittingCoupon = false;
      }
    );
  }

  @action
  async updateCoupon(input: UpdateCouponDto) {
    await this.wrapExecutionAsync(
      async () => {
        await couponsService.updateCoupon(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingCoupon = true;
      },
      () => {
        this.isSubmittingCoupon = false;
      }
    );
  }

  @action
  async getCoupon(input: EntityDto) {
    let coupon = await couponsService.getCoupon(input);
    if (coupon !== undefined) {
      this.couponModel = {
        id: coupon.id,
        classifications: coupon.classifications,
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        endDate: coupon.endDate,
        isFreeShipping: coupon.isFreeShipping,
        maxClientUseCount: coupon.maxClientUseCount,
        isExpired: coupon.isExpired,
        maxTotalUseCount: coupon.maxTotalUseCount,
        eventOrganizerInfo: coupon.eventOrganizerInfo,
        startDate: coupon.startDate,
        createdBy: coupon.createdBy,
        creationTime: coupon.creationTime,
        shopId: coupon.shopId,
        shop: coupon.shop,
        type: coupon.type,
        clients: coupon.clients,
      };
    }
  }
}

export default CouponStore;
