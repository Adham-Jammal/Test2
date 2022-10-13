import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { ReviewsPagedFilterRequest } from './dto/reviewsPagedFilterRequest';
import { ReviewDto } from './dto/ReviewDto';
import { EntityDto } from '../dto/entityDto';

class ReviewsService {

  public async getAll(input: ReviewsPagedFilterRequest): Promise<PagedResultDto<ReviewDto>> {
    let result = await http.get('api/services/app/Review/GetAll',
      { params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount, refId: input.refId,
         keyword: input.keyword, refType:input.refType, isHidden:input.isHidden } });
    return result.data.result;
  }

  public async showReview(input: EntityDto) {
    let result = await http.post('api/services/app/Review/Show', input,{ params: {culture:'en'} });
    return result.data;
  }

  public async hideReview(input: EntityDto) {
    let result = await http.post('api/services/app/Review/Hide', input,{ params: {culture:'en'} });
    return result.data;
  }

}

export default new ReviewsService();
