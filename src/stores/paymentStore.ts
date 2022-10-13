import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { PaymentDto } from '../services/payments/dto/paymentDto';
import paymentsService from '../services/payments/paymentsService';
import { PaymentMethod } from '../lib/types';

class PaymentStore extends StoreBase {
  @observable payments: Array<PaymentDto> = [];
  @observable loadingPayments = true;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable totalCount: number = 0;
  @observable paymentModel?: PaymentDto = undefined;
  @observable method?: PaymentMethod = undefined;
  @observable shopId?: number = undefined;
  @observable keyword?: string = undefined;

  @action
  async getPayments() {
    await this.wrapExecutionAsync(
      async () => {
        let result = await paymentsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          method: this.method,
          shopId: this.shopId,
        });
        this.payments = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingPayments = true;
      },
      () => {
        this.loadingPayments = false;
      }
    );
  }

  @action
  async getPayment(input: EntityDto) {
    let payment = await paymentsService.getPayment(input);
    if (payment !== undefined) {
      this.paymentModel = {
        id: payment.id,
        amount: payment.amount,
        creationTime: payment.creationTime,
        fee: payment.fee,
        shopId: payment.shopId,
        message: payment.message,
        method: payment.method,
        orderId: payment.orderId,
        orderNumber: payment.orderNumber,
        receipt: payment.receipt,
        receiptId: payment.receiptId,
        sender: payment.sender,
        senderId: payment.senderId,
        status: payment.status,
        transactionId: payment.transactionId,
      };
    }
  }
}

export default PaymentStore;
