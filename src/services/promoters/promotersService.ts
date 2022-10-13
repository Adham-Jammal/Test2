import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { UpdatePromoterDto } from './dto/updatePromoterDto';
import { CreatePromoterDto } from './dto/createPromoterDto';
import { PromotersPagedFilterRequest } from './dto/promotersPagedFilterRequest';
import { PromoterDto } from './dto/promoterDto';


class PromotersService {

  public async getAll(input: PromotersPagedFilterRequest): Promise<PagedResultDto<PromoterDto>> {
    let result = await http.get('api/services/app/Promoter/GetAll',
      { params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount,isActive:input.isActive,vehicleType:input.vehicleType,keyword:input.keyword } });
    return result.data.result;
  }

  public async getPromoter(input: EntityDto): Promise<PromoterDto> {
    let result = await http.get('api/services/app/Promoter/Get', { params: { id: input.id } });
    return result.data;
  }

  public async createPromoter(input: CreatePromoterDto): Promise<PromoterDto> {
    let result = await http.post('api/services/app/Promoter/Create', input);
    return result.data;
  }

  public async updatePromoter(input: UpdatePromoterDto): Promise<PromoterDto> {
    let result = await http.put('api/services/app/Promoter/Update', input);
    return result.data;
  }

}

export default new PromotersService();
