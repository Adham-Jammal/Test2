import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import reviewsService from '../services/reviews/reviewsService';
import { ReviewDto } from './../services/reviews/dto/ReviewDto';

class ReviewStore extends StoreBase {
  @observable reviews: Array<ReviewDto> = [];

  @observable loadingReviews = true;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  // @observable orderModel?: OrderDto = undefined;

  @observable shopFilter?: number = undefined;

  @observable refId?: number = undefined;

  @observable refType?: number = undefined;

  @observable keyword?: string = undefined;

  @observable isHidden?: boolean = false ;

  @action
  async getReviews() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await reviewsService.getAll({
          skipCount: this.skipCount,
           maxResultCount: this.maxResultCount,
           refId: this.refId,
           keyword: this.keyword,
           refType:this.refType,
           isHidden: false,
        });
        this.reviews = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingReviews = true;
      },
      () => {
        this.loadingReviews = false;
      }
    );
  }
}


export default ReviewStore;
