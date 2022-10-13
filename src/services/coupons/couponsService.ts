import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { CouponPagedFilterRequest } from './dto/couponPagedFilterRequest';
import { CouponDto } from './dto/couponDto';
import { CreateCouponDto } from './dto/createCouponDto';
import { UpdateCouponDto } from './dto/updateCouponDto';

class CouponsService {
  public async getAll(input: CouponPagedFilterRequest): Promise<PagedResultDto<CouponDto>> {
    let result = await http.get('api/services/app/Coupon/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        isActive: input.isActive,
        keyword: input.keyword,
        classificationId: input.classificationId,
        myCoupons: input.myCoupons,
        isFreeShipping: input.isFreeShipping,
        shopId: input.shopId,
        clientId: input.clientId,
      },
    });
    return result.data.result;
  }

  public async getCoupon(input: EntityDto): Promise<CouponDto> {
    let result = await http.get('api/services/app/Coupon/Get', { params: { id: input.id } });
    return result.data.result;
  }

  public async createCoupon(input: CreateCouponDto): Promise<CouponDto> {
    let result = await http.post('api/services/app/Coupon/Create', input);
    return result.data;
  }

  public async updateCoupon(input: UpdateCouponDto): Promise<CouponDto> {
    let result = await http.put('api/services/app/Coupon/Update', input);
    return result.data;
  }
}

export default new CouponsService();
