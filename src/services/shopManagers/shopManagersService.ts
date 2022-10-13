import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { AdminPagedFilterRequest } from '../admins/dto/adminPagedFilterRequest';
import { RegisterShopManagerDto, ShopManagerDto, UpdateShopManagerDto } from './dto/shopManagerDto';
import { CompletShopRegistrationDto, ShopDto } from '../shops/dto/shopDto';
import { LiteEntityDto } from '../dto/liteEntityDto';

class ShopManagersService {
  public async getAll(input: AdminPagedFilterRequest): Promise<PagedResultDto<ShopManagerDto>> {
    let result = await http.get('api/services/app/ShopManager/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        isActive: input.isActive,
        keyword: input.keyword,
      },
    });
    return result.data.result;
  }
  public async getAllLite(input?: AdminPagedFilterRequest): Promise<PagedResultDto<LiteEntityDto>> {
    let result = await http.get('api/services/app/ShopManager/GetAllLite', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        isActive: input?.isActive,
      },
    });
    return result.data.result;
  }

  public async getShopManager(input: EntityDto): Promise<ShopManagerDto> {
    let result = await http.get('api/services/app/ShopManager/Get', { params: { id: input.id } });
    return result.data;
  }
  public async getMyInfo(): Promise<ShopManagerDto> {
    let result = await http.get('api/services/app/ShopManager/GetMyInfo');
    return result.data.result;
  }

  public async registerShopManager(input: RegisterShopManagerDto): Promise<ShopManagerDto> {
    const result = await http.post('api/services/app/ShopManager/RegisterShopManager', input);
    return result.data;
  }

  public async updateShopManager(input: UpdateShopManagerDto): Promise<ShopManagerDto> {
    const result = await http.put('api/services/app/ShopManager/Update', input);
    return result.data;
  }

  public async CompletShopRegistration(input: CompletShopRegistrationDto): Promise<ShopDto> {
    const result = await http.post('api/services/app/Shop/CompletShopRegistration', input);
    return result.data;
  }
}

export default new ShopManagersService();
