import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { OrderDto } from '../services/orders/dto/orderDto';
import ordersService from '../services/orders/ordersService';
import { OrderType } from '../lib/types';

class OrderStore extends StoreBase {
  @observable orders: Array<OrderDto> = [];

  @observable loadingOrders = true;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable orderModel?: OrderDto = undefined;

  @observable shopFilter?: number = undefined;

  @observable statusFilter?: OrderType = undefined;

  @observable keyword?: string = undefined;

  @observable myOrders?: boolean = false;

  @action
  async getOrders() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await ordersService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          status: this.statusFilter,
          shopId: this.shopFilter,
          keyword: this.keyword,
          MyOrders: this.myOrders,
        });
        this.orders = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingOrders = true;
      },
      () => {
        this.loadingOrders = false;
      }
    );
  }

  @action
  async getOrder(input: EntityDto) {
    const order = this.orders.find((c) => c.id === input.id);
    if (order !== undefined) {
      this.orderModel = {
        client: order.client,
        creationTime: order.creationTime,
        fees: order.fees,
        id: order.id,
        items: order.items,
        number: order.number,
        paymentMethod: order.paymentMethod,
        shop: order.shop,
        status: order.status,
        invoice: order.invoice,
        totalOrderFee: order.totalOrderFee,
      };
    }
  }
}

export default OrderStore;
