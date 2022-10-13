import * as React from 'react';
import { Modal, Button, Tag, Table } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './orderDetailsModal.css';
import OrderStore from '../../../stores/orderStore';
import { OrderItemDto } from '../../../services/orders/dto/orderItemDto';
import ThousandSeparator from '../../../components/ThousandSeparator';
import { OrderType } from '../../../lib/types';

export interface IOrderDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  orderStore: OrderStore;
}

@inject(Stores.OrderStore)
@observer
class OrderDetailsModal extends React.Component<IOrderDetailsModalProps, any> {
  handleCancel = () => {
    this.props.onCancel();
  };

  renderOrderStatus = (status: number) => {
    switch (status) {
      case OrderType.Approved:
        return (
          <Tag color={'green'} className="ant-tag-disable-pointer">
            {L('Approved')}
          </Tag>
        );
      case OrderType.Cancelled:
        return (
          <Tag color={'red'} className="ant-tag-disable-pointer">
            {L('Cancelled')}
          </Tag>
        );
      case OrderType.Delivered:
        return (
          <Tag color={'lime'} className="ant-tag-disable-pointer">
            {L('Delivered')}
          </Tag>
        );
      case OrderType.InProgress:
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {L('InProgress')}
          </Tag>
        );
      case OrderType.OnTheWay:
        return (
          <Tag color={'purple'} className="ant-tag-disable-pointer">
            {L('OnTheWay')}
          </Tag>
        );
      case OrderType.Rejected:
        return (
          <Tag color={'error'} className="ant-tag-disable-pointer">
            {L('Rejected')}
          </Tag>
        );
      case OrderType.Waiting:
        return (
          <Tag color={'warning'} className="ant-tag-disable-pointer">
            {L('Waiting')}
          </Tag>
        );
    }
    return null;
  };

  orderItemsTableColumns = [
    {
      title: L('Product'),
      dataIndex: 'product',
      key: 'product',
      render: (product: any, item: OrderItemDto) => {
        return item.product.name;
      },
    },
    {
      title: L('Quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: L('Price'),
      dataIndex: 'price',
      key: 'price',
      render: (_: any, item: OrderItemDto) => {
        return <ThousandSeparator number={item.price} currency={L('SR')} />;
      },
    },
  ];

  render() {
    const { visible } = this.props;
    const { orderModel } = this.props.orderStore!;
    return (
      <Modal
        visible={visible}
        title={L('Details')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        width="60%"
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Close')}
          </Button>,
        ]}
      >
        <div className="order-details-modal">
          <div className="details-wrapper">
            <div className="detail-wrapper">
              <span className="detail-label">{L('Number')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.number : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('CreationTime')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.creationTime : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('Shop')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.shop.text : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('Fees')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.fees : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('ClientName')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.client.name : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('ClientPhoneNumber')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.client.phoneNumber : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('PaymentMethod')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.paymentMethod : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('Status')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? this.renderOrderStatus(orderModel.status) : undefined}
              </span>
            </div>

            {orderModel !== undefined && orderModel!.items.length > 0 && (
              <Table
                rowKey={(record) => record.id + ''}
                style={{ marginTop: '12px' }}
                loading={this.props.orderStore!.loadingOrders}
                dataSource={orderModel!.items}
                columns={this.orderItemsTableColumns}
              />
            )}
          </div>
        </div>
      </Modal>
    );
  }
}

export default OrderDetailsModal;
