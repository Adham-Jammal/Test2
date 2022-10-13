/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { LiteEntityDto } from '../locations/dto/liteEntityDto';
import { AvatarDto, AvatarPagedResultDto, CreateOrUpdateAvatarDto } from './dto';

class AvatarsService {
  public async getAll(input: AvatarPagedResultDto): Promise<PagedResultDto<AvatarDto>> {
    const { skipCount, maxResultCount, keyword, IsActive, Sorting } = input || {};
    const result = await http.get('api/services/app/Avatar/GetAll', {
      params: {
        skipCount,
        maxResultCount,
        IsActive,
        keyword,
        Sorting,
      },
    });
    return result.data.result;
  }

  public async getAllLite(input?: AvatarPagedResultDto): Promise<PagedResultDto<LiteEntityDto>> {
    const { skipCount, maxResultCount, keyword, IsActive } = input || {};
    const result = await http.get('api/services/app/Avatar/GetAllLite', {
      params: {
        skipCount,
        keyword,
        maxResultCount,
        IsActive,
      },
    });
    return result.data.result;
  }

  public async getAvatarById(input: EntityDto): Promise<AvatarDto> {
    const result = await http.get('api/services/app/Avatar/Get', { params: { id: input.id } });
    return result.data.result;
  }

  public async createAvatar(input: CreateOrUpdateAvatarDto): Promise<AvatarDto> {
    const result = await http.post('api/services/app/Avatar/Create', input);
    return result.data;
  }

  public async updateAvatar(input: CreateOrUpdateAvatarDto): Promise<AvatarDto> {
    const result = await http.put('api/services/app/Avatar/Update', input);
    return result.data;
  }

  public async avatarActivation(input: EntityDto) {
    const result = await http.put('api/services/app/Avatar/Activate', { id: input.id });
    return result.data;
  }

  public async avatarDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/Avatar/DeActivate', { id: input.id });
    return result.data;
  }

  public async avatarDelete(input: EntityDto) {
    const result = await http.delete('api/services/app/Avatar/Delete', {
      params: { id: input.id },
    });
    return result.data;
  }
}

export default new AvatarsService();
