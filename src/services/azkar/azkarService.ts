/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { AzkarDto, CreateOrUpdateAzkarDto, AzkarPagedResultDto } from './dto';
import { LiteEntityDto } from '../locations/dto/liteEntityDto';

class AzkarService {
  public async getAll(input: AzkarPagedResultDto): Promise<PagedResultDto<AzkarDto>> {
    const { skipCount, maxResultCount, keyword, CategoryId, IsActive,MinCreationTime,MaxCreationTime,Sorting} = input || {};
    const result = await http.get('api/services/app/Azkar/GetAll', {
      params: {
        skipCount,
        maxResultCount,
        keyword,
        CategoryId,
        IsActive,
        MinCreationTime,
        MaxCreationTime,
        Sorting
      },
    });
    return result.data.result;
  }

  public async getAllLite(input?: AzkarPagedResultDto): Promise<PagedResultDto<LiteEntityDto>> {
    const { skipCount, maxResultCount, keyword, CategoryId, IsActive } = input || {};
    const result = await http.get('api/services/app/Azkar/GetAllLite', {
      params: {
        skipCount,
        maxResultCount,
        keyword,
        CategoryId,
        IsActive,
      },
    });
    return result.data.result;
  }

  public async getAzkarById(input: EntityDto): Promise<AzkarDto> {
    const result = await http.get('api/services/app/Azkar/Get', { params: { id: input.id } });
    return result.data.result;
  }

  public async createAzkar(input: CreateOrUpdateAzkarDto): Promise<AzkarDto> {
    const result = await http.post('api/services/app/Azkar/Create', input);
    return result.data;
  }

  public async updateAzkar(input: CreateOrUpdateAzkarDto): Promise<AzkarDto> {
    const result = await http.put('api/services/app/Azkar/Update', input);
    return result.data;
  }

  public async azkarActivation(input: EntityDto) {
    const result = await http.put('api/services/app/Azkar/Activate', { id: input.id });
    return result.data;
  }

  public async azkarDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/Azkar/DeActivate', { id: input.id });
    return result.data;
  }

  public async azkarDelete(input: EntityDto) {
    const result = await http.delete('api/services/app/Azkar/Delete', {
      params: { id: input.id },
    });
    return result.data;
  }
}

export default new AzkarService();
