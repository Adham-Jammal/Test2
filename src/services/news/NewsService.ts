/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';
import { EntityDto } from '../dto/entityDto';
import { LiteEntityDto } from '../locations/dto/liteEntityDto';
import { NewsDto } from './dto/NewsDto';
import { CreateNewsDto } from './dto/createNewsDto';
import { UpdateNewsDto } from './dto/updateNewsDto';

class NewsService {
  public async getAll(input: PagedFilterAndSortedRequest): Promise<PagedResultDto<NewsDto>> {
    const result = await http.get('api/services/app/News/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        isActive: input.isActive,
        keyword: input.keyword,
        advancedSearchKeyword: input.advancedSearchKeyword,
        Sorting: input.sorting,
      },
    });
    return result.data.result;
  }

  public async getAllLite(): Promise<PagedResultDto<LiteEntityDto>> {
    let result = await http.get('api/services/app/News/GetAllLite');
    return result.data.result;
  }

  public async getNews(input: EntityDto): Promise<NewsDto> {
    let result = await http.get('api/services/app/News/Get', { params: { id: input.id } });
    return result.data;
  }

  public async createNews(input: CreateNewsDto): Promise<NewsDto> {
    let result = await http.post('api/services/app/News/Create', input);
    return result.data;
  }

  public async updateNews(input: UpdateNewsDto): Promise<NewsDto> {
    let result = await http.put('api/services/app/News/Update', input);
    return result.data;
  }

  public async newsActivation(input: EntityDto) {
    let result = await http.put('api/services/app/News/Activate', input);
    return result.data;
  }
  public async newsDeactivation(input: EntityDto) {
    let result = await http.put('api/services/app/News/DeActivate', input);
    return result.data;
  }
}

export default new NewsService();
