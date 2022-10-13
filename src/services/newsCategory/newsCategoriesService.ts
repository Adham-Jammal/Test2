/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { NewsCategoryDto } from './dto/newsCategoryDto';
import { CreateNewsCategoryDto } from './dto/createNewsCategoryDto';
import { UpdateNewsCategoryDto } from './dto/updateNewsCategoryDto';
import { EntityDto } from '../dto/entityDto';
import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';

class NewsCategoriesService {
  public async getAll(
    input?: PagedFilterAndSortedRequest
  ): Promise<PagedResultDto<NewsCategoryDto>> {
    const result = await http.get('api/services/app/NewsCategory/GetAll', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        isActive: input?.isActive,
        keyword: input?.keyword,
        advancedSearchKeyword: input?.advancedSearchKeyword,
        Sorting: input?.sorting,
      },
    });
    return result.data.result;
  }

  public async getNewsCategory(input: EntityDto): Promise<NewsCategoryDto> {
    const result = await http.get('api/services/app/NewsCategory/Get', {
      params: { id: input.id },
    });
    return result.data.result;
  }

  public async createNewsCategory(input: CreateNewsCategoryDto): Promise<NewsCategoryDto> {
    const result = await http.post('api/services/app/NewsCategory/Create', input);
    return result.data;
  }

  public async updateNewsCategory(input: UpdateNewsCategoryDto): Promise<NewsCategoryDto> {
    const result = await http.put('api/services/app/NewsCategory/Update', input);
    return result.data;
  }

  public async newsCategoryDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/NewsCategory/DeActivate', input);
    return result.data;
  }

  public async newsCategoryActivation(input: EntityDto) {
    const result = await http.put('api/services/app/NewsCategory/Activate', input);
    return result.data;
  }
}

export default new NewsCategoriesService();
