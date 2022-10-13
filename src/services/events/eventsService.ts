/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { EventDto } from './dto/eventDto';
import { CreateOrUpdateEventDto } from './dto/createOrUpdateEventDto';
import { EventsPagedFilterRequest } from './dto/eventsPagedFilterRequest';
import { LiteEntityDto } from '../locations/dto/liteEntityDto';
import { EventOrderDto } from './dto/updateEventOrdersDto';
import ChangeStatusDto from '../../components/ChangeStatusModal/ChangeStatusDto';

class EventsService {
  public async getAll(input: EventsPagedFilterRequest): Promise<PagedResultDto<EventDto>> {
    const result = await http.get('api/services/app/Event/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        type: input.type,
        status: input.status,
        keyword: input.keyword,
        categoryId: input.categoryId,
        Sorting: input.Sorting,
        OnlyMyEvents: input.OnlyMyEvents,
        expired: input.expired,
        running: input.running,
        parentId: input.parentId,
      },
    });
    return result.data.result;
  }

  public async getSchedules(input: EventsPagedFilterRequest): Promise<PagedResultDto<EventDto>> {
    const result = await http.get('api/services/app/Event/GetEventSchedules', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        type: input.type,
        status: input.status,
        keyword: input.keyword,
        categoryId: input.categoryId,
        Sorting: input.Sorting,
        OnlyMyEvents: input.OnlyMyEvents,
        expired: input.expired,
        running: input.running,
        parentId: input.parentId,
      },
    });
    return result.data.result;
  }

  public async getRecurringDates(input: EventsPagedFilterRequest): Promise<Array<any>> {
    const result = await http.get('api/services/app/Event/GetRecurringDates', {
      params: {
        endAfterEvents: input.endAfterEvents,
        repeat: input.repeat,
        startDate: input.startDate,
        endDate: input.endDate,
      },
    });
    return result.data.result;
  }

  public async getAllLite(
    input?: EventsPagedFilterRequest
  ): Promise<PagedResultDto<LiteEntityDto>> {
    const result = await http.get('api/services/app/Event/GetAllLite', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        type: input?.type,
        status: input?.status,
        organizerId: input?.organizerId,
      },
    });
    return result.data.result;
  }

  public async getEvent(input: EntityDto): Promise<EventDto> {
    const result = await http.get('api/services/app/Event/Get', { params: { id: input.id } });
    return result.data.result;
  }

  public async createEvent(input: CreateOrUpdateEventDto): Promise<EventDto> {
    const result = await http.post('api/services/app/Event/Create', input);
    return result.data.result;
  }
  public async deleteEvent(input: EntityDto): Promise<EventDto> {
    const result = await http.delete(`api/services/app/Event/Delete?id=${input.id}`);
    return result.data.result;
  }

  public async updateEvent(input: CreateOrUpdateEventDto): Promise<EventDto> {
    const result = await http.put('api/services/app/Event/Update', input);
    return result.data.result;
  }

  public async updateEventOrders(input: EventOrderDto[]) {
    const result = await http.put('api/services/app/Event/UpdateOrders', { orders: input });
    return result.data;
  }

  public async eventActivation(input: EntityDto) {
    const result = await http.put('api/services/app/Event/Activate', input);
    return result.data;
  }

  public async eventDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/Event/DeActivate', input);
    return result.data;
  }

  public async changeStatus(input: ChangeStatusDto) {
    const result = await http.put('api/services/app/Event/ChangeStatus', input);
    return result.data;
  }
}

export default new EventsService();
