import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { ClassificationDto } from './dto/classificationDto';
import { UpdateClassificationDto } from './dto/updateClassificationDto';
import { CreateClassificationDto } from './dto/createClassificationDto';
import { ClassificationPagedFilterRequest } from './dto/classificationsPagedFilterRequest';
import { LiteEntityDto } from '../locations/dto/liteEntityDto';
import ChangeStatusDto from '../../components/ChangeStatusModal/ChangeStatusDto';

class ClassificationsService {
  public async getAll(
    input: ClassificationPagedFilterRequest
  ): Promise<PagedResultDto<ClassificationDto>> {
    const result = await http.get('api/services/app/Classification/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        categoryId: input.categoryId,
        isActive: input.isActive,
        keyword: input.keyword,
      },
    });
    return result.data.result;
  }

  public async getAllLite(input?: any): Promise<PagedResultDto<LiteEntityDto>> {
    const result = await http.get('api/services/app/Classification/GetAllLite', {
      params: {
        skipCount: 0,
        maxResultCount: 100,
        isActive: true,
        CategoryIds: input?.CategoryIds,
      },
    });
    return result.data.result;
  }

  public async getClassification(input: EntityDto): Promise<ClassificationDto> {
    const result = await http.get('api/services/app/Classification/Get', {
      params: { id: input.id },
    });
    return result.data;
  }

  public async createClassification(input: CreateClassificationDto): Promise<ClassificationDto> {
    const result = await http.post('api/services/app/Classification/Create', input);
    return result.data;
  }

  public async updateClassification(input: UpdateClassificationDto): Promise<ClassificationDto> {
    const result = await http.put('api/services/app/Classification/Update', input);
    return result.data;
  }

  public async classificationActivation(input: EntityDto) {
    const result = await http.put('api/services/app/Classification/Activate', input);
    return result.data;
  }

  public async classificationDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/Classification/DeActivate', input);
    return result.data;
  }

  public async changeStatus(input: ChangeStatusDto) {
    const result = await http.put('api/services/app/Classification/ChangeStatus', input);
    return result.data;
  }
}

export default new ClassificationsService();
