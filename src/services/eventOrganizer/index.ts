import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import {
  EventOrganizerPagedFilterRequest,
  CreateEventOrganizerDto,
  EventOrganizerDto,
  CreateOrUpdateEventOrganizerDto,
} from './dto';
import { LiteEntityDto } from '../dto/liteEntityDto';

class EventOrganizerService {
  public async getAll(
    input: EventOrganizerPagedFilterRequest
  ): Promise<PagedResultDto<EventOrganizerDto>> {
    const { data: result } = await http.get('api/services/app/EventOrganizer/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        isActive: input.isActive,
        keyword: input.keyword,
      },
    });
    return result.result;
  }

  public async getAllLite(
    input?: EventOrganizerPagedFilterRequest
  ): Promise<PagedResultDto<LiteEntityDto>> {
    const result = await http.get('api/services/app/EventOrganizer/GetAllLite', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        isActive: input?.isActive,
      },
    });
    return result.data.result;
  }

  public async getEventOrganizer(input: EntityDto): Promise<EventOrganizerDto> {
    const { data } = await http.get('api/services/app/EventOrganizer/Get', {
      params: { id: input.id },
    });
    return data.result;
  }

  public async createEventOrganizer(
    input: CreateOrUpdateEventOrganizerDto
  ): Promise<EventOrganizerDto> {
    const { data } = await http.post('api/services/app/EventOrganizer/Create', input);
    return data;
  }

  public async eventOrganizerRegister(input: CreateEventOrganizerDto): Promise<EventOrganizerDto> {
    const { data } = await http.post('api/services/app/Account/RegisterAsEventOrganizer', input);
    return data;
  }

  public async updateEventOrganizer(
    input: CreateOrUpdateEventOrganizerDto
  ): Promise<EventOrganizerDto> {
    const { data } = await http.put('api/services/app/EventOrganizer/Update', input);
    return data;
  }

  public async verifyOrganizer(input: EntityDto) {
    const { data } = await http.post('api/services/app/Account/VerifyAccount', input);
    return data;
  }

  public async eventOrganizerActivation(input: EntityDto) {
    const { data } = await http.put('api/services/app/EventOrganizer/SwitchActivation', input);
    return data;
  }
}

export default new EventOrganizerService();
