import { GetCurrentLoginInformations } from './dto/getCurrentLoginInformations';
import http from '../httpService';
import { EntityDto } from '../dto/entityDto';
import { SessionsPagedFilterRequest } from './dto/sessionsPagedFilterRequest';
import { PagedResultDto } from '../dto/pagedResultDto';
import { SessionDto } from './dto/sessionDto';
import { LiteEntityDto } from '../dto/liteEntityDto';
import { CreateSessiontDto } from './dto/createSessionDto';
import { UpdateSessiontDto } from './dto/updateSessionDto';

declare var abp: any;

class SessionService {
  public async getCurrentLoginInformations(): Promise<GetCurrentLoginInformations> {
    let result = await http.get('api/services/app/Session/GetCurrentLoginInformations', {
      headers: {
        'Abp.TenantId': abp.multiTenancy.getTenantIdCookie(),
      },
    });

    return result.data.result;
  }

  public async getAll(input: SessionsPagedFilterRequest): Promise<PagedResultDto<SessionDto>> {
    const result = await http.get('api/services/app/Session/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        status: input.status,
        keyword: input.keyword,
        advancedSearchKeyword: input.advancedSearchKeyword,
        sorting: input.sorting,
      },
    });
    return result.data.result;
  }

  public async getAllLite(
    input?: SessionsPagedFilterRequest
  ): Promise<PagedResultDto<LiteEntityDto>> {
    const result = await http.get('api/services/app/Session/GetAllLite', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        status: input?.status,
      },
    });
    return result.data.result;
  }

  public async getSession(input: EntityDto): Promise<SessionDto> {
    const result = await http.get('api/services/app/Session/Get', { params: { id: input.id } });
    return result.data.result;
  }

  public async createSession(input: CreateSessiontDto): Promise<SessionDto> {
    const result = await http.post('api/services/app/Session/Create', input);
    return result.data;
  }

  public async updateSession(input: UpdateSessiontDto): Promise<SessionDto> {
    const result = await http.put('api/services/app/Session/Update', input);
    return result.data;
  }

  public async sessionActivation(input: EntityDto) {
    const result = await http.put('api/services/app/Session/Activate', input);
    return result.data;
  }

  public async sessionDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/Session/DeActivate', input);
    return result.data;
  }
}

export default new SessionService();
