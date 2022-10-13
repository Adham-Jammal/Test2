/* eslint-disable */
import * as React from 'react';
import { Row, Col, Card, Tooltip, Table, Tag, Button, Select } from 'antd';
import './index.less';
import {
  CheckSquareOutlined,
  DownOutlined,
  EyeOutlined,
  FilterOutlined,
  UpOutlined,
} from '@ant-design/icons';
import EventOrganizerDetailsModal from '../EventOrganizers/components/EventOrgnizerDetails';

import { L } from '../../i18next';
import ThousandSeparator from '../../components/ThousandSeparator';
import localization from '../../lib/localization';
import ShopStore from '../../stores/shopStore';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import { EntityDto } from '../../services/dto/entityDto';
import { ShopDto } from '../../services/shops/dto/shopDto';
import { popupConfirm } from '../../lib/popupMessages';
import SearchComponent from '../../components/SearchComponent';
import ShopDetailsModal from '../Shops/components/shopDetailsModal';
import EventOrganizerStore from '../../stores/eventOrganizerStore';
import { EventOrganizerDto } from '../../services/eventOrganizer/dto';
import timingHelper from '../../lib/timingHelper';
import moment from 'moment';
import OrderStore from '../../stores/orderStore';
import { OrderType, PaymentMethod } from '../../lib/types';
import { OrderDto } from '../../services/orders/dto/orderDto';
import OrderDetailsModal from '../Orders/components/orderDetailsModal';
import { AdminStatistcsDto } from '../../services/dashboard/dto/dashboardDto';
import dashboardService from '../../services/dashboard/dashboardService';

export interface IDashboardState {
  dashboardData: AdminStatistcsDto;
  cardLoading: boolean;
  loadingReports: boolean;
  shopDetailsModalVisible: boolean;
  shopKeyword?: string;
  shopMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    skipCount: number;
    pageTotal: number;
    total: number;
  };
  organizerKeyword?: string;
  organizerMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    skipCount: number;
    pageTotal: number;
    total: number;
  };
  eventOrganizerModalVisible: boolean;
  orderDetailsModalVisible: boolean;
  orderKeyword?: string;
  orderMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    skipCount: number;
    pageTotal: number;
    total: number;
  };
  orderStatusFilter?: number;
}
export interface IDashboardProps {
  shopStore?: ShopStore;
  orderStore?: OrderStore;
  eventOrganizerStore?: EventOrganizerStore;
}

export interface ListItem {
  title: string;
  body: string | React.ReactNode;
}
const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.ShopStore, Stores.EventOrganizerStore, Stores.OrderStore)
@observer
export class Dashboard extends React.Component<IDashboardProps, IDashboardState> {
  state = {
    dashboardData: {} as AdminStatistcsDto,
    cardLoading: true,
    loadingReports: false,
    shopDetailsModalVisible: false,
    shopKeyword: undefined,
    shopMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      skipCount: 0,
      pageTotal: 1,
      total: 0,
    },
    eventOrganizerModalVisible: false,
    organizerKeyword: undefined,
    organizerMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      skipCount: 0,
      pageTotal: 1,
      total: 0,
    },
    orderDetailsModalVisible: false,
    orderKeyword: undefined,
    orderMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      skipCount: 0,
      pageTotal: 1,
      total: 0,
    },
    orderStatusFilter: undefined,
  };

  async componentDidMount() {
    const dashboardData = await dashboardService.getAdminStatistics();
    this.setState({ dashboardData: dashboardData });
    setTimeout(() => this.setState({ cardLoading: false }), 0);
    await this.updateShopsList(this.state.shopMeta.pageSize, 0);
    await this.updateEventOrganizersList(this.state.organizerMeta.pageSize, 0);
    await this.updateOrdersList(this.state.orderMeta.pageSize, 0);
  }
  async updateOrdersList(maxResultCount: number, skipCount: number) {
    this.props.orderStore!.maxResultCount = maxResultCount;
    this.props.orderStore!.skipCount = skipCount;
    this.props.orderStore!.keyword = this.state.orderKeyword;
    this.props.orderStore!.statusFilter = this.state.orderStatusFilter;

    this.props.orderStore!.getOrders();
  }
  updateEventOrganizersList = async (maxResultCount: number, skipCount: number): Promise<void> => {
    const { eventOrganizerStore } = this.props!;
    eventOrganizerStore!.maxResultCount = maxResultCount;
    eventOrganizerStore!.skipCount = skipCount;
    eventOrganizerStore!.isActiveFilter = false;
    eventOrganizerStore!.keyword = this.state.organizerKeyword;
    eventOrganizerStore!.getEventOrganizers();
  };
  openEventOrganizerDetailsModal = async (organizerId: number): Promise<void> => {
    const { eventOrganizerStore } = this.props!;
    await eventOrganizerStore!.getEventOrganizer({ id: organizerId });
    this.setState({ eventOrganizerModalVisible: true });
  };
  async openOrderDetailsModal(entityDto: EntityDto) {
    await this.props.orderStore!.getOrder(entityDto);
    this.setState({ orderDetailsModalVisible: !this.state.orderDetailsModalVisible });
  }
  onSwitchOrganizerActivation = async (organizer: EventOrganizerDto): Promise<void> => {
    popupConfirm(
      async () => {
        if (organizer.isActive) {
          await this.props.eventOrganizerStore!.organizerDeactivation({ id: organizer.id! });
        } else await this.props.eventOrganizerStore!.organizerActivation({ id: organizer.id! });
        await this.updateEventOrganizersList(
          this.state.organizerMeta.pageSize,
          this.state.organizerMeta.skipCount
        );
      },
      organizer.isActive
        ? L('AreYouSureYouWantToBlockThisEventOrganizer')
        : L('AreYouSureYouWantToActivateThisEventOrganizer')
    );
  };

  async updateShopsList(maxResultCount: number, skipCount: number) {
    this.props.shopStore!.maxResultCount = maxResultCount;
    this.props.shopStore!.skipCount = skipCount;
    this.props.shopStore!.keyword = this.state.shopKeyword;
    this.props.shopStore!.isActiveFilter = false;
    this.props.shopStore!.getShops();
  }

  async openShopDetailsModal(entityDto: EntityDto) {
    await this.props.shopStore!.getShopFromAPI(entityDto);
    this.setState({
      shopDetailsModalVisible: !this.state.shopDetailsModalVisible,
    });
  }
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
          value={this.state.orderStatusFilter}
          onChange={(value: any) => {
            this.setState({ orderStatusFilter: value });
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
            this.updateOrdersList(this.state.orderMeta.pageSize, this.state.orderMeta.skipCount);
          }}
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({ orderStatusFilter: undefined }, () => {
              this.updateOrdersList(this.state.orderMeta.pageSize, this.state.orderMeta.skipCount);
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
      title: L('Shop'),
      dataIndex: 'shop',
      key: 'shop',
      render: (shop: string, item: OrderDto) => {
        return item.shop.text;
      },
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
        </div>
      ),
    },
  ];

  orderPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.orderMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateOrdersList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.orderMeta.page = page;
      this.setState(temp);
      await this.updateOrdersList(
        this.state.orderMeta.pageSize,
        (page - 1) * this.state.orderMeta.pageSize
      );
    },
    pageSizeOptions: this.state.orderMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  onSwitchShopActivation = async (shop: ShopDto) => {
    popupConfirm(
      async () => {
        if (shop.isActive) await this.props.shopStore!.shopDeactivation({ id: shop.id });
        else await this.props.shopStore!.shopActivation({ id: shop.id });
        await this.updateShopsList(this.state.shopMeta.pageSize, this.state.shopMeta.skipCount);
      },
      shop.isActive
        ? L('AreYouSureYouWantToDeactivateThisShop')
        : L('AreYouSureYouWantToActivateThisShop')
    );
  };

  shopsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: L('Code'),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: L('City'),
      dataIndex: 'city',
      key: 'city',
      render: (_: any, record: ShopDto) => (record.city ? record.city?.text : L('NotAvailable')),
    },

    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: ShopDto) => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon "
              onClick={() => this.openShopDetailsModal({ id: item.id })}
            />
          </Tooltip>

          {!item.isActive && (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.onSwitchShopActivation(item)}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  shopPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.shopMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateShopsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.shopMeta.page = page;
      this.setState(temp);
      await this.updateShopsList(
        this.state.shopMeta.pageSize,
        (page - 1) * this.state.shopMeta.pageSize
      );
    },
    pageSizeOptions: this.state.shopMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  eventOrganizersTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, item: EventOrganizerDto): string =>
        `${name ?? ''} ${item.surname ?? ''}`,
    },

    {
      title: L('UserName'),
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: L('RegistrationDate'),
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      render: (registrationDate: string) =>
        moment(registrationDate).format(timingHelper.defaultDateFormat),
    },

    {
      title: L('Action'),
      key: 'action',
      render: (_1: unknown, item: EventOrganizerDto): JSX.Element => {
        return (
          <div>
            <Tooltip title={L('Details')}>
              <EyeOutlined
                className="action-icon "
                onClick={() => this.openEventOrganizerDetailsModal(item.id!)}
              />
            </Tooltip>
            {!item.isActive && (
              <Tooltip title={L('Activate')}>
                <CheckSquareOutlined
                  className="action-icon  green-text"
                  onClick={() => this.onSwitchOrganizerActivation(item)}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  organizerPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: number, pageSize: number): Promise<void> => {
      const temp = this.state;
      temp.organizerMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateEventOrganizersList(pageSize, 0);
    },
    onChange: async (page: number): Promise<void> => {
      const temp = this.state;
      temp.organizerMeta.page = page;
      this.setState(temp);
      await this.updateEventOrganizersList(
        this.state.organizerMeta.pageSize,
        (page - 1) * this.state.organizerMeta.pageSize
      );
    },
    pageSizeOptions: this.state.organizerMeta.pageSizeOptions,
    showTotal: (total: number, range: number[]): string =>
      `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  render() {
    const { cardLoading, dashboardData } = this.state;
    const shops = this.props.shopStore!.shops;
    const shopPagination = {
      ...this.shopPaginationOptions,
      total: this.props.shopStore!.totalCount,
      current: this.state.shopMeta.page,
      pageSize: this.state.shopMeta.pageSize,
    };
    const orders = this.props.orderStore!.orders;
    const orderPagination = {
      ...this.orderPaginationOptions,
      total: this.props.orderStore!.totalCount,
      current: this.state.orderMeta.page,
      pageSize: this.state.orderMeta.pageSize,
    };
    const organizers = this.props.eventOrganizerStore!.eventOrganizers;
    const organizerPagination = {
      ...this.organizerPaginationOptions,
      total: this.props.eventOrganizerStore!.totalCount,
      current: this.state.organizerMeta.page,
      pageSize: this.state.organizerMeta.pageSize,
    };
    return (
      <>
        <Row className={localization.isRTL() ? 'rtl topBoxes' : 'topBoxes'}>
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={5}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.activeClients} />
              </label>
              <span className="dashboardCardName">{L('ActiveClients')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={5}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.activeShops} />
              </label>
              <span className="dashboardCardName">{L('ActiveShops')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={5}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.activeOrganizers} />
              </label>
              <span className="dashboardCardName">{L('ActiveEventOrganizers')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={5}>
            <Card className="dasboardCard-item " loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.activeChallenges} />
              </label>
              <span className="dashboardCardName">{L('ActiveChallenges')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={5}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.profit} />
              </label>
              <span className="dashboardCardName">{L('ProfitAmount')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={5}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.pendingShops} />
              </label>
              <span className="dashboardCardName">{L('PendingShops')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>{' '}
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={5}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.pendingOrganizers} />
              </label>
              <span className="dashboardCardName">{L('PendingEventOrganizers')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>{' '}
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={5}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.activeStories} />
              </label>
              <span className="dashboardCardName">{L('ActiveStories')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>
        </Row>
        <Row gutter={50}>
          <Col span={24}>
            <Card
              className="dashboardBox"
              title={
                <div>
                  <span>{L('PendingShops')}</span>
                </div>
              }
              bordered={false}
            >
              <Row>
                <SearchComponent
                  onSearch={(value: string) => {
                    this.setState({ shopKeyword: value }, () => {
                      this.updateShopsList(
                        this.state.shopMeta.pageSize,
                        this.state.shopMeta.skipCount
                      );
                    });
                  }}
                />
                <Col xs={24}>
                  <Table
                    pagination={shopPagination}
                    rowKey={(record) => record.id + ''}
                    style={{ marginTop: '12px' }}
                    loading={this.props.shopStore!.loadingShops}
                    dataSource={shops === undefined ? [] : shops}
                    columns={this.shopsTableColumns}
                  />
                </Col>
                <ShopDetailsModal
                  visible={this.state.shopDetailsModalVisible}
                  onCancel={() =>
                    this.setState({
                      shopDetailsModalVisible: false,
                    })
                  }
                  shopStore={this.props.shopStore!}
                />
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Card
              className="dashboardBox"
              title={
                <div>
                  <span>{L('PendingEventOrganizers')}</span>
                </div>
              }
              bordered={false}
            >
              <Row>
                <SearchComponent
                  onSearch={(value: string) => {
                    this.setState({ organizerKeyword: value }, () => {
                      this.updateEventOrganizersList(
                        this.state.organizerMeta.pageSize,
                        this.state.organizerMeta.skipCount
                      );
                    });
                  }}
                />
                <Col xs={24}>
                  <Table
                    pagination={organizerPagination}
                    rowKey={(record) => record.id + ''}
                    style={{ marginTop: '12px' }}
                    loading={this.props.eventOrganizerStore!.loadingOrganizers}
                    dataSource={organizers === undefined ? [] : organizers}
                    columns={this.eventOrganizersTableColumns}
                    expandable={{
                      expandIcon: ({ expanded, onExpand, record }) =>
                        expanded ? (
                          <UpOutlined
                            className="expand-icon"
                            onClick={(e) => onExpand(record, e)}
                          />
                        ) : (
                          <DownOutlined
                            className="expand-icon"
                            onClick={(e) => onExpand(record, e)}
                          />
                        ),
                      expandedRowRender: (record) => (
                        <p className="expanded-row" style={{ margin: 0 }}>
                          <span>
                            <b> {L('Email')}: </b>
                            {record.emailAddress}
                          </span>
                          <span>
                            <b> {L('PhoneNumber')}: </b>
                            {record.countryCode ? record.countryCode : '' + '' + record.phoneNumber}
                          </span>
                        </p>
                      ),
                      rowExpandable: (record) => true,
                    }}
                  />
                </Col>
                <EventOrganizerDetailsModal
                  visible={this.state.eventOrganizerModalVisible}
                  onCancel={() =>
                    this.setState({
                      eventOrganizerModalVisible: false,
                    })
                  }
                  organizerData={this.props.eventOrganizerStore?.organizerData}
                  isGettingData={this.props.eventOrganizerStore?.isGettingOrganizerData}
                />
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Card
              className="dashboardBox"
              title={
                <div>
                  <span>{L('Orders')}</span>

                  {/* <a
                    download="orders.xlsx"
                    className="excelBtn"
                    style={{ float: localization.getFloat() }}
                    id="ordersExport"
                    href="#"
                    onClick={() => {
                      return ExcellentExport.convert(
                        {
                          anchor: document.getElementById('ordersExport') as HTMLAnchorElement,
                          filename: L('Orders'),
                          format: 'xlsx',
                        },
                        [
                          {
                            name: L('Orders'),
                            from: {
                              table: document.getElementById('ordersDatatable') as HTMLTableElement,
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <FileExcelOutlined />
                  </a> */}
                </div>
              }
              bordered={false}
            >
              <Row>
                <SearchComponent
                  onSearch={(value: string) => {
                    this.setState({ orderKeyword: value }, () => {
                      this.updateOrdersList(
                        this.state.orderMeta.pageSize,
                        this.state.orderMeta.skipCount
                      );
                    });
                  }}
                />
                <Col xs={24}>
                  <Table
                    pagination={orderPagination}
                    rowKey={(record) => record.id + ''}
                    style={{ marginTop: '12px' }}
                    loading={this.props.orderStore!.loadingOrders}
                    dataSource={orders === undefined ? [] : orders}
                    columns={this.ordersTableColumns}
                    expandable={{
                      expandIcon: ({ expanded, onExpand, record }) =>
                        expanded ? (
                          <UpOutlined
                            className="expand-icon"
                            onClick={(e) => onExpand(record, e)}
                          />
                        ) : (
                          <DownOutlined
                            className="expand-icon"
                            onClick={(e) => onExpand(record, e)}
                          />
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
                </Col>
                <OrderDetailsModal
                  visible={this.state.orderDetailsModalVisible}
                  onCancel={() =>
                    this.setState({
                      orderDetailsModalVisible: false,
                    })
                  }
                  orderStore={this.props.orderStore!}
                />
              </Row>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default Dashboard;
