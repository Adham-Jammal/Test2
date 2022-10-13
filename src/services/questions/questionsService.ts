/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { LiteEntityDto } from '../locations/dto/liteEntityDto';
import { CreateOrUpdateQuestionDto, QuestionDto, QuestionPagedResultDto } from './dto';

class QuestionsService {
  public async getAll(input: QuestionPagedResultDto): Promise<PagedResultDto<QuestionDto>> {
    const { skipCount, maxResultCount, keyword, IsActive, Sorting } = input || {};
    const result = await http.get('api/services/app/Question/GetAll', {
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

  public async getAllLite(input?: QuestionPagedResultDto): Promise<PagedResultDto<LiteEntityDto>> {
    const { skipCount, maxResultCount, keyword, IsActive } = input || {};
    const result = await http.get('api/services/app/Question/GetAllLite', {
      params: {
        skipCount,
        keyword,
        maxResultCount,
        IsActive,
      },
    });
    return result.data.result;
  }

  public async getQuestionById(input: EntityDto): Promise<QuestionDto> {
    const result = await http.get('api/services/app/Question/Get', { params: { id: input.id } });
    return result.data.result;
  }

  public async createQuestion(input: CreateOrUpdateQuestionDto): Promise<QuestionDto> {
    const result = await http.post('api/services/app/Question/Create', input);
    return result.data;
  }

  public async updateQuestion(input: CreateOrUpdateQuestionDto): Promise<QuestionDto> {
    const result = await http.put('api/services/app/Question/Update', input);
    return result.data;
  }

  public async questionActivation(input: EntityDto) {
    const result = await http.put('api/services/app/Question/Activate', { id: input.id });
    return result.data;
  }

  public async questionDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/Question/DeActivate', { id: input.id });
    return result.data;
  }

  public async questionDelete(input: EntityDto) {
    const result = await http.delete('api/services/app/Question/Delete', {
      params: { id: input.id },
    });
    return result.data;
  }
}

export default new QuestionsService();
