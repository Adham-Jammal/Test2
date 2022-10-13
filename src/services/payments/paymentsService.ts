import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { PaymentDto } from './dto/paymentDto';
import { PaymentPagedFilterRequest } from './dto/paymentPagedFilterRequest';

class PaymentsService {

  public async getAll(input: PaymentPagedFilterRequest): Promise<PagedResultDto<PaymentDto>> {
    let result = await http.get('api/services/app/Payment/GetAll',
      { params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount, method: input.method, keyword: input.keyword, shopId:input.shopId } });
    return result.data.result;
  }

  public async getPayment(input: EntityDto): Promise<PaymentDto> {
    let result = await http.get('api/services/app/Payment/GetByTransactionId', { params: { id: input.id } });
    return result.data;
  }

}

export default new PaymentsService();
