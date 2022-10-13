/* eslint-disable */
import * as React from 'react';
import { Card, Table, Tag, Select, Button,Tooltip} from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import {
  DownOutlined,
  EyeOutlined,
  FilterOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { EntityDto } from '../../services/dto/entityDto';
import OrderStore from '../../stores/orderStore';
import { OrderDto } from '../../services/orders/dto/orderDto';
import moment from 'moment';
import timingHelper from '../../lib/timingHelper';
import SearchComponent from '../../components/SearchComponent';
import shopsService from '../../services/shops/shopsService';
import { LiteEntityDto } from '../../services/locations/dto/liteEntityDto';
import { ShopDto } from '../../services/shops/dto/shopDto';
import { OrderType, PaymentMethod } from '../../lib/types';
import OrderDetailsModal from './components/orderDetailsModal';

export interface IOrdersProps {
  orderStore: OrderStore;
}

export interface IOrdersState {
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  orderDetailsModalVisible: boolean;
  permisssionsGranted: {
    activation: boolean;
  };
  keyword?: string;
  statusFilter?: number;
  shopFilter?: number;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.OrderStore)
@observer
export class Orders extends AppComponentBase<IOrdersProps, IOrdersState> {
  currentUser: any = undefined;
  shops: LiteEntityDto[] = [];
  shopInfo: ShopDto | undefined = undefined;

  state = {
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    orderDetailsModalVisible: false,
    permisssionsGranted: {
      activation: false,
    },
    keyword: undefined,
    statusFilter: undefined,
    shopFilter: undefined,
  };

  async openOrderDetailsModal(entityDto: EntityDto) {
    await this.props.orderStore!.getOrder(entityDto);
    this.setState({ orderDetailsModalVisible: !this.state.orderDetailsModalVisible });
  }

  async componentDidMount() {
    try {
      let result2 = await shopsService.getCurrentShopInfo();
      this.shopInfo = result2;
    } catch {
      window.location.href = '/user/shop/complete-registeration';
    }
    let result = await shopsService.getAllLite();
    this.shops = result.items;
    this.updateOrdersList(this.state.meta.pageSize, 0);
  }

  async updateOrdersList(maxResultCount: number, skipCount: number) {
    this.props.orderStore!.maxResultCount = maxResultCount;
    this.props.orderStore!.skipCount = skipCount;
    this.props.orderStore!.shopFilter = this.state.shopFilter;
    this.props.orderStore!.statusFilter = this.state.statusFilter;
    this.props.orderStore!.keyword = this.state.keyword;
    this.props.orderStore!.myOrders = true;
    this.props.orderStore!.getOrders();
  }
  getColumnShopSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          placeholder={L('PleaseSelectShop')}
          optionFilterProp="children"
          filterOption={(input, option: any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          value={this.state.shopFilter}
          onChange={(value: any) => {
            this.setState({ shopFilter: value });
          }}
        >
          {this.shops.length > 0 &&
            this.shops.map((element: LiteEntityDto) => (
              <Select.Option key={element.value} value={element.value}>
                {element.text}
              </Select.Option>
            ))}
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateOrdersList(this.state.meta.pageSize, this.state.meta.skipCount);
          }}
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({ shopFilter: undefined }, () => {
              this.updateOrdersList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
          size="small"
          style={{ width: 90 }}
        >
          {L('ResetFilter')}
        </Button>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  });

  getColumnStatusSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          placeholder={L('PleaseSelectStatus')}
          optionFilterProp="children"
          filterOption={(input, option: any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          value={this.state.statusFilter}
          onChange={(value: any) => {
            this.setState({ statusFilter: value });
          }}
        >
          <Select.Option value={OrderType.Approved} key={OrderType.Approved}>
            {L('Approved')}
          </Select.Option>
          <Select.Option value={OrderType.Cancelled} key={OrderType.Cancelled}>
            {L('Cancelled')}
          </Select.Option>
          <Select.Option value={OrderType.Delivered} key={OrderType.Delivered}>
            {L('Delivered')}
          </Select.Option>
          <Select.Option value={OrderType.InProgress} key={OrderType.InProgress}>
            {L('InProgress')}
          </Select.Option>
          <Select.Option value={OrderType.OnTheWay} key={OrderType.OnTheWay}>
            {L('OnTheWay')}
          </Select.Option>
          <Select.Option value={OrderType.Rejected} key={OrderType.Rejected}>
            {L('Rejected')}
          </Select.Option>
          <Select.Option value={OrderType.Waiting} key={OrderType.Waiting}>
            {L('Waiting')}
          </Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateOrdersList(this.state.meta.pageSize, this.state.meta.skipCount);
          }}
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({ statusFilter: undefined }, () => {
              this.updateOrdersList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
          size="small"
          style={{ width: 90 }}
        >
          {L('ResetFilter')}
        </Button>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  });

  // onSwitchProductActivation = async (product: ProductDto) => {
  //   popupConfirm(async () => {
  //     if(product.isActive)
  //     await this.props.productStore!.productDeactivation({ id: product.id });
  //     else
  //     await this.props.productStore!.productActivation({ id: product.id });
  //   }, product.isActive ? L('AreYouSureYouWantToDeactivateThisProduct') : L('AreYouSureYouWantToActivateThisProduct'));
  // }

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

  ordersTableColumns = [
    {
      title: L('Number'),
      dataIndex: 'number',
      key: 'number',
    },

    {
      title: L('ClientName'),
      dataIndex: 'client',
      key: 'client',
      render: (client: string, item: OrderDto) => {
        return item.client.name;
      },
    },

    {
      title: L('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderType) => {
        return this.renderOrderStatus(status);
      },
      ...this.getColumnStatusSearchProps(),
    },

    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: OrderDto) => (
      <div>
        <Tooltip title={L('Details')}>
          <EyeOutlined
            className="action-icon "
            onClick={() => this.openOrderDetailsModal({ id: item.id })}
          />
        </Tooltip>
        
      </div>)
    },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateOrdersList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateOrdersList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const orders = this.props.orderStore!.orders;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.orderStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card title={L('MyOrders')}>
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateOrdersList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />
        <Table
          pagination={pagination}
          rowKey={(record) => record.id + ''}
          style={{ marginTop: '12px' }}
          loading={this.props.orderStore!.loadingOrders}
          dataSource={orders === undefined ? [] : orders}
          columns={this.ordersTableColumns}
          expandable={{
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <UpOutlined className="expand-icon" onClick={(e) => onExpand(record, e)} />
              ) : (
                <DownOutlined className="expand-icon" onClick={(e) => onExpand(record, e)} />
              ),
            expandedRowRender: (record) => (
              <p className="expanded-row" style={{ margin: 0 }}>
                <span>
                  <b>{L('ClientPhoneNumber')}: </b>
                  {record.client.phoneNumber}
                </span>
                <span>
                  <b>{L('Fees')}: </b>
                  {record.totalOrderFee}
                </span>
                <span>
                  <b>{L('Invoice')}: </b>
                  <a href={record.invoice}>{L('Invoice')}</a>
                </span>
                <span>
                  <b>{L('PaymentMethod')}: </b>
                  <Tag color={'processing'} className="ant-tag-disable-pointer">
                    {record.paymentMethod === PaymentMethod.ApplePay
                      ? L('ApplePay')
                      : record.paymentMethod === PaymentMethod.Cash
                      ? L('Cash')
                      : record.paymentMethod === PaymentMethod.CreditCard
                      ? L('CreditCard')
                      : record.paymentMethod === PaymentMethod.Mada
                      ? L('Mada')
                      : L('STCPay')}
                  </Tag>
                </span>

                <span>
                  <b> {L('CreationDate')}: </b>
                  {moment(record.creationTime).format(timingHelper.defaultDateFormat)}
                </span>
              </p>
            ),
            rowExpandable: (record) => true,
          }}
        />

        <OrderDetailsModal
          visible={this.state.orderDetailsModalVisible}
          onCancel={() =>
            this.setState({
              orderDetailsModalVisible: false,
            })
          }
          orderStore={this.props.orderStore!}
        />
      </Card>
    );
  }
}

export default Orders;
