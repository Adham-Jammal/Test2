/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { BundlePagedResultDto, BundleDto, CreateOrUpdateBundleDto } from './dto';
import { LiteEntityDto } from '../locations/dto/liteEntityDto';

class BundlesService {
  public async getAll(input: BundlePagedResultDto): Promise<PagedResultDto<BundleDto>> {
    const { skipCount, maxResultCount, key, IsActive, Sorting } = input || {};
    const result = await http.get('api/services/app/Bundle/GetAll', {
      params: {
        skipCount,
        maxResultCount,
        IsActive,
        Sorting,
        key,
      },
    });
    return result.data.result;
  }

  public async getAllLite(input?: BundlePagedResultDto): Promise<PagedResultDto<LiteEntityDto>> {
    const { skipCount, maxResultCount, key, IsActive } = input || {};
    const result = await http.get('api/services/app/Bundle/GetAllLite', {
      params: {
        skipCount,
        key,
        maxResultCount,
        IsActive,
      },
    });
    return result.data.result;
  }

  public async getBundleById(input: EntityDto): Promise<BundleDto> {
    const result = await http.get('api/services/app/Bundle/Get', { params: { id: input.id } });
    return result.data.result;
  }

  public async createBundle(input: CreateOrUpdateBundleDto): Promise<BundleDto> {
    const result = await http.post('api/services/app/Bundle/Create', input);
    return result.data;
  }

  public async updateBundle(input: CreateOrUpdateBundleDto): Promise<BundleDto> {
    const result = await http.put('api/services/app/Bundle/Update', input);
    return result.data;
  }

  public async bundleActivation(input: EntityDto) {
    const result = await http.put('api/services/app/Bundle/Activate', { id: input.id });
    return result.data;
  }

  public async bundleDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/Bundle/DeActivate', { id: input.id });
    return result.data;
  }
}

export default new BundlesService();
