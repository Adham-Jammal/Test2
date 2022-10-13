import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { CategoryDto } from './dto/categoryDto';
import { EntityDto } from '../dto/entityDto';
import { CreateCategoryDto } from './dto/createCategoryDto';
import { UpdateCategoryDto } from './dto/updateCategoryDto';
import { LiteEntityDto } from '../locations/dto/liteEntityDto';
import { EventOrderDto } from '../events/dto/updateEventOrdersDto';
import { CategoryFilterInputDto } from './dto/categoryFilterInputDto';
import ChangeStatusDto from '../../components/ChangeStatusModal/ChangeStatusDto';

class CategoriesService {
  public async getAll(input: CategoryFilterInputDto): Promise<PagedResultDto<CategoryDto>> {
    const result = await http.get('api/services/app/Category/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        isActive: input.isActive,
        keyword: input.keyword,
      },
    });
    return result.data.result;
  }

  public async getAllLite(): Promise<PagedResultDto<LiteEntityDto>> {
    const result = await http.get('api/services/app/Category/GetAllLite', {
      params: {
        skipCount: 0,
        isActive: true,
        maxResultCount: 100,
      },
    });
    return result.data.result;
  }

  public async getCategory(input: EntityDto): Promise<CategoryDto> {
    const result = await http.get('api/services/app/Category/Get', { params: { id: input.id } });
    return result.data.result;
  }

  public async createCategory(input: CreateCategoryDto): Promise<CategoryDto> {
    const result = await http.post('api/services/app/Category/Create', input);
    return result.data;
  }

  public async updateCategory(input: UpdateCategoryDto): Promise<CategoryDto> {
    const result = await http.put('api/services/app/Category/Update', input);
    return result.data;
  }

  public async categoryActivation(input: EntityDto) {
    const result = await http.put('api/services/app/Category/Activate', input);
    return result.data;
  }

  public async categoryDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/Category/DeActivate', input);
    return result.data;
  }

  public async updateCategoryOrders(input: EventOrderDto[]) {
    const result = await http.put('api/services/app/Category/UpdateOrders', { orders: input });
    return result.data;
  }

  public async changeStatus(input: ChangeStatusDto) {
    const result = await http.put('api/services/app/Category/ChangeStatus', input);
    return result.data;
  }
}

export default new CategoriesService();
