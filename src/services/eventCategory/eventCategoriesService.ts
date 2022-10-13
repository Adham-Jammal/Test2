/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import {
  EventCategoryDto,
  CreateOrUpdateEventCategoryDto,
  EventCategoryPagedFilterRequest,
} from './dto';
import { EntityDto } from '../dto/entityDto';

class EventCategoriesService {
  public async getAll(
    input: EventCategoryPagedFilterRequest
  ): Promise<PagedResultDto<EventCategoryDto>> {
    const result = await http.get('api/services/app/EventCategory/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        isActive: input.isActive,
        keyword: input.keyword,
      },
    });
    return result.data.result;
  }

  public async getEventCategory(input: EntityDto): Promise<EventCategoryDto> {
    const result = await http.get('api/services/app/EventCategory/Get', {
      params: { id: input.id },
    });
    return result.data.result;
  }

  public async createEventCategory(
    input: CreateOrUpdateEventCategoryDto
  ): Promise<EventCategoryDto> {
    const result = await http.post('api/services/app/EventCategory/Create', input);
    return result.data;
  }

  public async updateEventCategory(
    input: CreateOrUpdateEventCategoryDto
  ): Promise<EventCategoryDto> {
    const result = await http.put('api/services/app/EventCategory/Update', input);
    return result.data;
  }

  public async eventCategoryDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/EventCategory/DeActivate', input);
    return result.data;
  }

  public async eventCategoryActivation(input: EntityDto) {
    const result = await http.put('api/services/app/EventCategory/Activate', input);
    return result.data;
  }
}

export default new EventCategoriesService();
