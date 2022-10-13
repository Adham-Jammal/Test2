import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { LiteEntityDto } from '../locations/dto/liteEntityDto';
import { ShopsPagedFilterRequest } from './dto/shopsPagedFilterRequest';
import { ShopDto } from './dto/shopDto';
import { CreateOrUpdateShopDto } from './dto/createShopDto';

class ShopsService {
  public async getAll(input: ShopsPagedFilterRequest): Promise<PagedResultDto<ShopDto>> {
    let result = await http.get('api/services/app/Shop/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        keyword: input.keyword,
        isActive: input.isActive,
      },
    });
    return result.data.result;
  }

  public async getAllLite(input?: ShopsPagedFilterRequest): Promise<PagedResultDto<LiteEntityDto>> {
    let result = await http.get('api/services/app/Shop/GetAllLite', {
      params: { skipCount: input?.skipCount, maxResultCount: input?.maxResultCount },
    });
    return result.data.result;
  }

  public async getShop(input: EntityDto): Promise<ShopDto> {
    let result = await http.get('api/services/app/Shop/Get', { params: { id: input.id } });
    return result.data.result;
  }

  public async getCurrentShopInfo(): Promise<ShopDto> {
    let result = await http.get('api/services/app/Shop/GetCurrentShopInfo');
    return result.data.result;
  }

  public async createShop(input: CreateOrUpdateShopDto): Promise<ShopDto> {
    let result = await http.post('api/services/app/Shop/Create', input);
    return result.data;
  }

  public async updateShop(input: CreateOrUpdateShopDto): Promise<ShopDto> {
    let result = await http.put('api/services/app/Shop/Update', input);
    return result.data;
  }

  public async shopActivation(input: EntityDto) {
    let result = await http.put('api/services/app/Shop/Activate', input);
    return result.data;
  }

  public async shopDeactivation(input: EntityDto) {
    let result = await http.put('api/services/app/Shop/DeActivate', input);
    return result.data;
  }

  public async deleteShop(input: EntityDto) {
    let result = await http.delete('api/services/app/Shop/Delete', { params: { id: input.id } });
    return result.data;
  }
}

export default new ShopsService();
