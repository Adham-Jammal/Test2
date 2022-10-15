import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { OrdersPagedFilterRequest } from './dto/ordersPagedFilterRequest';
import { OrderDto } from './dto/orderDto';
import { ChangeStatusInputDto } from './dto/changeStatusInputDto';

class OrdersService {
  public async getAll(input: OrdersPagedFilterRequest): Promise<PagedResultDto<OrderDto>> {
    const result = await http.get('api/services/app/Order/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        shopId: input.shopId,
        status: input.status,
        keyword: input.keyword,
        MyOrders: input.MyOrders,
      },
    });
    return result.data.result;
  }

  public async getOrder(input: EntityDto): Promise<OrderDto> {
    const result = await http.get('api/services/app/Order/Get', { params: { id: input.id } });
    return result.data;
  }

  public async changeStatus(input: ChangeStatusInputDto) {
    const result = await http.put('api/services/app/Order/ChangeStatus', input);
    return result.data;
  }

  public async rejectOrder(input: EntityDto) {
    const result = await http.post('api/services/app/Order/Reject', { id: input.id });
    return result.data;
  }  
  public async approveOrder(input: EntityDto) {
    const result = await http.post('api/services/app/Order/Approve', { id: input.id });
    return result.data;
  }
  public async CancelOrder(input: EntityDto) {
    const result = await http.put('api/services/app/Order/Cancel', { id: input.id });
    return result.data;
  }
}

export default new OrdersService();
