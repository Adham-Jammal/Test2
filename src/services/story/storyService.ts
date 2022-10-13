import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import {
  StoryFilterAndSortedReq,
  CreateStoryDto,
  StoryDto,
  UpdateStoryDto,
  UpdateStoriesOrderDto,
} from './dto';
import { EntityDto } from '../dto/entityDto';

class StoryService {
  public async getAll(input: StoryFilterAndSortedReq): Promise<PagedResultDto<StoryDto>> {
    const result = await http.get('api/services/app/Story/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        IsActive: input.IsActive,
        keyword: input.keyword,
        advancedSearchKeyword: input.advancedSearchKeyword,
        Sorting: input.sorting,
      },
    });
    return result.data.result;
  }

  public async getStory(input: EntityDto): Promise<StoryDto> {
    const result = await http.get('api/services/app/Story/Get', { params: { Id: input.id } });
    return result.data.result;
  }

  public async createStory(input: CreateStoryDto): Promise<StoryDto> {
    const result = await http.post('api/services/app/Story/Create', input);
    return result.data;
  }
  public async updateOrders(input: UpdateStoriesOrderDto): Promise<any> {
    const result = await http.put('api/services/app/Story/UpdateOrders', input);
    return result.data;
  }
  public async updateStory(input: UpdateStoryDto): Promise<StoryDto> {
    const result = await http.put('api/services/app/Story/Update', input);
    return result.data;
  }

  public async activateStory(input: EntityDto): Promise<StoryDto> {
    const result = await http.put('api/services/app/Story/Activate', input);
    return result.data;
  }

  public async deActivateStory(input: EntityDto): Promise<StoryDto> {
    const result = await http.put('api/services/app/Story/DeActivate', input);
    return result.data;
  }

  public async deleteStory(input: EntityDto): Promise<void> {
    const result = await http.delete('api/services/app/Story/Delete', {
      params: { Id: input.id },
    });
    return result.data;
  }
}
export default new StoryService();
