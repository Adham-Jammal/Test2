import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { ExerciseDto } from './dto/exerciseDto';
import { CreateExercisetDto } from './dto/createExerciseDto';
import { ExercisesPagedFilterRequest } from './dto/exercisesPagedFilterRequest';
import { LiteEntityDto } from '../locations/dto/liteEntityDto';
import { UpdateExercisetDto } from './dto/updateExerciseDto';

class ExercisesService {
  public async getAll(input: ExercisesPagedFilterRequest): Promise<PagedResultDto<ExerciseDto>> {
    const result = await http.get('api/services/app/Exercise/GetAll', {
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

  public async getAllLite(
    input?: ExercisesPagedFilterRequest
  ): Promise<PagedResultDto<LiteEntityDto>> {
    const result = await http.get('api/services/app/Exercise/GetAllLite', {
      params: {
        skipCount: input?.skipCount,
        maxResultCount: input?.maxResultCount,
        isActive: input?.isActive,
      },
    });
    return result.data.result;
  }

  public async getExercise(input: EntityDto): Promise<ExerciseDto> {
    const result = await http.get('api/services/app/Exercise/Get', { params: { id: input.id } });
    return result.data.result;
  }

  public async createExercise(input: CreateExercisetDto): Promise<ExerciseDto> {
    const result = await http.post('api/services/app/Exercise/Create', input);
    return result.data;
  }

  public async updateExercise(input: UpdateExercisetDto): Promise<ExerciseDto> {
    const result = await http.put('api/services/app/Exercise/Update', input);
    return result.data;
  }

  public async exerciseActivation(input: EntityDto) {
    const result = await http.put('api/services/app/Exercise/Activate', input);
    return result.data;
  }

  public async exerciseDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/Exercise/DeActivate', input);
    return result.data;
  }
}

export default new ExercisesService();
