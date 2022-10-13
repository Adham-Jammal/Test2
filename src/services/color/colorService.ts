/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { LiteEntityDto } from '../locations/dto/liteEntityDto';
import { PagedResultDto } from '../dto/pagedResultDto';

class ColorsService {
  public async getAllLite(
  ): Promise<PagedResultDto<LiteEntityDto>> {
    const result = await http.get('api/services/app/Color/GetAllLite',{
      params: {
        maxResultCount: 100,
      },
    });
    return result.data.result;
  }
}

export default new ColorsService();
