/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { ChallengePagedResultDto, CreateOrUpdateChallengeDto, ChallengeDto } from './dto';
import { LiteEntityDto } from '../locations/dto/liteEntityDto';

class ChallengesService {
  public async getAll(input: ChallengePagedResultDto): Promise<PagedResultDto<ChallengeDto>> {
    const { skipCount, maxResultCount, keyword, IsActive, Sorting, IsExpired } = input || {};
    const result = await http.get('api/services/app/Challenge/GetAll', {
      params: {
        skipCount,
        maxResultCount,
        IsActive,
        keyword,
        Sorting,
        IsExpired,
      },
    });
    return result.data.result;
  }

  public async getAllLite(input?: ChallengePagedResultDto): Promise<PagedResultDto<LiteEntityDto>> {
    const { skipCount, maxResultCount, keyword, IsActive, IsExpired } = input || {};
    const result = await http.get('api/services/app/Challenge/GetAllLite', {
      params: {
        skipCount,
        keyword,
        maxResultCount,
        IsExpired,
        IsActive,
      },
    });
    return result.data.result;
  }

  public async getChallengeById(input: EntityDto): Promise<ChallengeDto> {
    const result = await http.get('api/services/app/Challenge/Get', { params: { id: input.id } });
    return result.data.result;
  }

  public async createChallenge(input: CreateOrUpdateChallengeDto): Promise<ChallengeDto> {
    const result = await http.post('api/services/app/Challenge/Create', input);
    return result.data;
  }

  public async updateChallenge(input: CreateOrUpdateChallengeDto): Promise<ChallengeDto> {
    const result = await http.put('api/services/app/Challenge/Update', input);
    return result.data;
  }

  public async challengeActivation(input: EntityDto) {
    const result = await http.put('api/services/app/Challenge/Activate', { id: input.id });
    return result.data;
  }

  public async challengeDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/Challenge/DeActivate', { id: input.id });
    return result.data;
  }

  public async challengeDelete(input: EntityDto) {
    const result = await http.delete('api/services/app/Challenge/Delete', {
      params: { id: input.id },
    });
    return result.data;
  }
}

export default new ChallengesService();
