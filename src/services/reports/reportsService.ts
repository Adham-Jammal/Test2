import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { ReportPagedFilterRequest } from './dto/reportPagedFilterRequest';
import { ReportDto } from './dto/ReportDto';

class ReportsService {

  public async getAll(input: ReportPagedFilterRequest): Promise<PagedResultDto<ReportDto>> {
    let result = await http.get('api/services/app/Report/GetAll',
      { params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount, refId: input.refId,
         keyword: input.keyword, refType:input.refType } });
    return result.data.result;
  }

}

export default new ReportsService();
