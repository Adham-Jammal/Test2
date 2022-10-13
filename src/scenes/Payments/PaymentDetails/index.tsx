/* eslint-disable */
import * as React from 'react';
import { Tag, Tabs } from 'antd';
import { InfoCircleOutlined, ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import ThousandSeparator from '../../../components/ThousandSeparator';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';
import { L } from '../../../i18next';
import AppComponentBase from '../../../components/AppComponentBase';
import './index.css';
import localization from '../../../lib/localization';
import { PaymentDto } from '../../../services/payments/dto/paymentDto';
import paymentsService from '../../../services/payments/paymentsService';
import { PaymentMethod } from '../../../lib/types';

const { TabPane } = Tabs;

export interface IPaymentDetailsModalState {
  paymentModel: PaymentDto;
}

export class PaymentDetails extends AppComponentBase<any, IPaymentDetailsModalState> {
  state = {
    paymentModel: {} as PaymentDto,
  };

  renderPaymentMethod = (method: number) => {
    switch (method) {
      case PaymentMethod.ApplePay:
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {L('ApplePay')}
          </Tag>
        );
      case PaymentMethod.Cash:
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {L('Cash')}
          </Tag>
        );
      case PaymentMethod.CreditCard:
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {L('CreditCard')}
          </Tag>
        );
      case PaymentMethod.Mada:
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {L('Mada')}
          </Tag>
        );
      case PaymentMethod.STCPay:
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {L('STCPay')}
          </Tag>
        );
    }
    return null;
  };

  async componentDidMount() {
    document.title = `${L('PaymentDetails')} | MOHRA `;

    try {
      if (this.props.match.params.id) {
        let id = this.props.match.params.id;
        let payment = await paymentsService.getPayment({ id: id });
        this.setState({ paymentModel: payment });
      }
    } catch (e) {
      window.location.href = '/payments';
    }
  }
  render() {
    const { paymentModel } = this.state;
    return (
      <div className="order-page">
        <span className="back-button">
          {localization.isRTL() ? (
            <ArrowRightOutlined onClick={() => (window.location.href = '/payments')} />
          ) : (
            <ArrowLeftOutlined onClick={() => (window.location.href = '/payents')} />
          )}
        </span>

        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <InfoCircleOutlined />
                {L('General')}
              </span>
            }
            key="1"
          >
            <div className="details-wrapper">
              <div className="detail-wrapper">
                <span className="detail-label">{L('ID')}:</span>
                <span className="detail-value">
                  {paymentModel !== undefined ? paymentModel.id : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('TransactionId')}:</span>
                <span className="detail-value">
                  {paymentModel !== undefined ? paymentModel.transactionId : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('OrderNumber')}:</span>
                <span className="detail-value">
                  {paymentModel !== undefined ? paymentModel.orderNumber : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('ShopId')}:</span>
                <span className="detail-value">
                  {paymentModel !== undefined ? paymentModel.shopId : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('OrderId')}:</span>
                <span className="detail-value">
                  {paymentModel !== undefined ? (
                    <a href={`/order/${paymentModel.orderId}`} target="_blank">
                      {paymentModel.orderId}
                    </a>
                  ) : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Sender')}:</span>
                <span className="detail-value">
                  {paymentModel !== undefined && paymentModel.sender
                    ? paymentModel.sender.text
                    : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Receipt')}:</span>
                <span className="detail-value">
                  {paymentModel !== undefined && paymentModel.receipt
                    ? paymentModel.receipt.text
                    : undefined}
                </span>
              </div>

              <div className="detail-wrapper">
                <span className="detail-label">{L('PaymentMethod')}:</span>
                <span className="detail-value">
                  {paymentModel !== undefined
                    ? this.renderPaymentMethod(paymentModel.method)
                    : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Status')}:</span>
                <span className="detail-value">
                  {paymentModel !== undefined ? paymentModel.status : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Amount')}:</span>
                <span className="detail-value">
                  {paymentModel !== undefined && paymentModel.amount !== undefined ? (
                    <ThousandSeparator number={paymentModel.amount} currency={L('SAR')} />
                  ) : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Fee')}:</span>
                <span className="detail-value">
                  {paymentModel !== undefined && paymentModel.fee !== undefined ? (
                    <ThousandSeparator number={paymentModel.fee} currency={L('SAR')} />
                  ) : (
                    L('NotAvailable')
                  )}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Message')}:</span>
                <span className="detail-value">
                  {paymentModel !== undefined ? paymentModel.message : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('CreationTime')}:</span>
                <span className="detail-value">
                  {paymentModel !== undefined
                    ? moment(paymentModel.creationTime).format(timingHelper.defaultDateTimeFormat)
                    : undefined}
                </span>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default PaymentDetails;
