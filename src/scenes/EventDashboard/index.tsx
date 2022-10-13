/* eslint-disable */
import * as React from 'react';
import { Row, Col, Card, Tag, Tooltip, Image, Table } from 'antd';
import './index.less';
import { fallBackImage } from '../../constants';
import EventDetailsModal from '../MyEvents/components/eventDetailsModal';
import ExcellentExport from 'excellentexport';
import { DownOutlined, EyeOutlined, FileExcelOutlined, UpOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form/Form';
import { L } from '../../i18next';
import { OrganizerStatisticsDto } from '../../services/dashboard/dto/dashboardDto';
import ThousandSeparator from '../../components/ThousandSeparator';
import localization from '../../lib/localization';
import dashboardService from '../../services/dashboard/dashboardService';
import { EventTypes, PaymentMethod } from '../../lib/types';
import EventStore from '../../stores/eventStore';
import { EntityDto } from '../../services/dto/entityDto';
import timingHelper from '../../lib/timingHelper';
import { EventDto } from '../../services/events/dto/eventDto';
import moment from 'moment';
import SearchComponent from '../../components/SearchComponent';
import Stores from '../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';

export interface IDashboardProps {
  eventStore?: EventStore;
}
export interface IDashboardState {
  dashboardData: OrganizerStatisticsDto;
  cardLoading: boolean;
  loadingReports: boolean;
  runningMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  expiredMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  eventDetailsModalVisible: boolean;
  runningKeyword?: string;
  expiredKeyword?: string;
}
const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

export interface ListItem {
  title: string;
  body: string | React.ReactNode;
}
@inject(Stores.EventStore)
@observer
export class Dashboard extends React.Component<IDashboardProps, IDashboardState> {
  formRef = React.createRef<FormInstance>();

  state = {
    dashboardData: {} as OrganizerStatisticsDto,
    cardLoading: true,
    loadingReports: false,
    runningMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    expiredMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    eventDetailsModalVisible: false,
    runningKeyword: undefined,
    expiredKeyword: undefined,
  };

  async componentDidMount() {
    const dashboardData = await dashboardService.getOrganizerStatistics();
    this.setState({ dashboardData: dashboardData });
    setTimeout(() => this.setState({ cardLoading: false }), 0);
    this.updateRunningEventsList(this.state.runningMeta.pageSize, 0);
    this.updateExpiredEventsList(this.state.expiredMeta.pageSize, 0);
  }
  async updateRunningEventsList(maxResultCount: number, skipCount: number, sorting?: string) {
    this.props.eventStore!.maxResultCount = maxResultCount;
    this.props.eventStore!.skipCount = skipCount;
    this.props.eventStore!.keyword = this.state.expiredKeyword;
    this.props.eventStore!.onlyMyEvents = true;
    this.props.eventStore!.sorting = sorting;
    this.props.eventStore!.running = true;
    this.props.eventStore!.getRunningEvents();
  }
  async updateExpiredEventsList(maxResultCount: number, skipCount: number, sorting?: string) {
    this.props.eventStore!.maxResultCount = maxResultCount;
    this.props.eventStore!.skipCount = skipCount;
    this.props.eventStore!.keyword = this.state.expiredKeyword;
    this.props.eventStore!.onlyMyEvents = true;
    this.props.eventStore!.sorting = sorting;
    this.props.eventStore!.expired = true;
    this.props.eventStore!.getExpiredEvents();
  }

  ordersColumns = [
    {
      title: L('Number'),
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: `${L('TotalValue')} (${L('SAR')})`,
      dataIndex: 'totalValue',
      key: 'totalValue',
      render: (totalValue: number) => {
        return <ThousandSeparator number={totalValue} />;
      },
    },
    {
      title: `${L('DeliveryFee')} (${L('SAR')})`,
      dataIndex: 'deliveryFee',
      key: 'deliveryFee',
      render: (deliveryFee: number) => {
        return <ThousandSeparator number={deliveryFee} />;
      },
    },
    {
      title: `${L('ShopCommission')} (${L('SAR')})`,
      dataIndex: 'shopCommission',
      key: 'shopCommission',
      render: (shopCommission: number) => {
        return <ThousandSeparator number={shopCommission} />;
      },
    },
    {
      title: `${L('DeliveryBoyCommission')} (${L('SAR')})`,
      dataIndex: 'deliveryBoyCommission',
      key: 'deliveryBoyCommission',
      render: (deliveryBoyCommission: number) => {
        return <ThousandSeparator number={deliveryBoyCommission} />;
      },
    },
    {
      title: L('ClientName'),
      dataIndex: 'clientName',
      key: 'clientName',
    },

    {
      title: L('PaymentMethod'),
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (paymentMethod: number) => {
        let paymentMethodName;
        switch (paymentMethod) {
          case PaymentMethod.ApplePay:
            paymentMethodName = L('ApplePay');
            break;
          case PaymentMethod.Cash:
            paymentMethodName = L('Cash');
            break;
          case PaymentMethod.CreditCard:
            paymentMethodName = L('CreditCard');
            break;
          case PaymentMethod.Mada:
            paymentMethodName = L('Mada');
            break;
          case PaymentMethod.STCPay:
            paymentMethodName = L('STCPay');
        }
        return (
          <Tag color="processing" className="ant-tag-disable-pointer">
            {paymentMethodName}
          </Tag>
        );
      },
    },
  ];

  runningPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.runningMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateRunningEventsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.runningMeta.page = page;
      this.setState(temp);
      await this.updateRunningEventsList(
        this.state.runningMeta.pageSize,
        (page - 1) * this.state.runningMeta.pageSize
      );
    },
    pageSizeOptions: this.state.runningMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };
  expiredPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.expiredMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateExpiredEventsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.expiredMeta.page = page;
      this.setState(temp);
      await this.updateExpiredEventsList(
        this.state.expiredMeta.pageSize,
        (page - 1) * this.state.expiredMeta.pageSize
      );
    },
    pageSizeOptions: this.state.expiredMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  eventsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Title'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: L('eventTime'),
      dataIndex: 'fromDate',
      key: 'fromDate',
      render: (fromDate: Date, item: EventDto): string =>
        `${moment(item.startDate).format(timingHelper.defaultDateFormat)} ${L('To')} ${moment(
          item.endDate
        ).format(timingHelper.defaultDateFormat)} `,
    },

    {
      title: L('Action'),
      key: 'action',
      render: (_: string, item: EventDto): JSX.Element => {
        return (
          <div>
            <Tooltip title={L('Details')}>
              <EyeOutlined
                className="action-icon"
                onClick={() => this.openEventDetailsModal({ id: item.id! })}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  async openEventDetailsModal(entity: EntityDto) {
    this.props.eventStore!.getEvent(entity);
    this.setState({
      eventDetailsModalVisible: !this.state.eventDetailsModalVisible,
    });
  }

  render() {
    const { cardLoading, dashboardData } = this.state;
    const runningPagination = {
      ...this.runningPaginationOptions,
      total: this.props.eventStore?.runningTotalCount,
      current: this.state.runningMeta.page,
      pageSize: this.state.runningMeta.pageSize,
    };
    const expiredpagination = {
      ...this.expiredPaginationOptions,
      total: this.props.eventStore?.expiredTotalCount,
      current: this.state.expiredMeta.page,
      pageSize: this.state.expiredMeta.pageSize,
    };
    return (
      <>
        <Row className={localization.isRTL() ? 'rtl topBoxes' : 'topBoxes'}>
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={4}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.activeFreeEvents} />
              </label>
              <span className="dashboardCardName">{L('ActiveFreeEvents')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={4}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.activeOnlineEvents} />
              </label>
              <span className="dashboardCardName">{L('ActiveOnlineEvents')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={4}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.activePrivateEvents} />
              </label>
              <span className="dashboardCardName">{L('ActivePrivateEvents')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={4}>
            <Card className="dasboardCard-item " loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.activePayWithSeatsEvents} />
              </label>
              <span className="dashboardCardName">{L('ActivePayWithSeatsEvents')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={4}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.activePayWithEntranceEvents} />
              </label>
              <span className="dashboardCardName">{L('ActivePayWithEntranceEvents')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={5}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.runningEvents} />
              </label>
              <span className="dashboardCardName">{L('RunningEvents')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>{' '}
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={5}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.tickets} />
              </label>
              <span className="dashboardCardName">{L('Tickets')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>{' '}
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={5}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.usedTickets} />
              </label>
              <span className="dashboardCardName">{L('SoldTickets')}</span>
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
        </Row>
        <Row gutter={50}>
          <Col span={24}>
            <Card
              className="dashboardBox"
              title={
                <div>
                  <span>{L('RunningEvents')}</span>

                  <a
                    download="running-events.xlsx"
                    className="excelBtn"
                    style={{ float: localization.getFloat() }}
                    id="runningExport"
                    href="#"
                    onClick={() => {
                      return ExcellentExport.convert(
                        {
                          anchor: document.getElementById('runningExport') as HTMLAnchorElement,
                          filename: L('RunningEvents'),
                          format: 'xlsx',
                        },
                        [
                          {
                            name: L('RunningEvents'),
                            from: {
                              table: document.getElementById(
                                'runningDatatable'
                              ) as HTMLTableElement,
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <FileExcelOutlined />
                  </a>
                </div>
              }
              bordered={false}
            >
              <Row>
                <table id="runningDatatable" style={{ display: 'none' }}>
                  <thead>
                    <tr>
                      <td>{L('ID')}</td>
                      <td>{L('Title')}</td>
                      <td>{L('About')}</td>
                      <td>{L('Description')}</td>
                      <td>{L('Type')}</td>
                      <td>{L('Category')}</td>
                      <td>{L('Tags')}</td>
                      <td>{L('City')}</td>
                      <td>{L('StartDate')}</td>
                      <td>{L('EndDate')}</td>
                      <td>{L('CreationDate')}</td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.eventStore?.runningEvents.map((event: EventDto, index: number) => {
                      return (
                        <tr key={index}>
                          <td>{event.id}</td>
                          <td>{event.title}</td>
                          <td>{event.about}</td>
                          <td>{event.description}</td>
                          <td>
                            {event.eventType === EventTypes.Free
                              ? L('Free')
                              : event.eventType === EventTypes.Online
                              ? L('Online')
                              : event.eventType === EventTypes.PayWithEnterance
                              ? L('PayWithEnterance')
                              : event.eventType === EventTypes.PayWithSeats
                              ? L('PayWithSeats')
                              : L('Private')}
                          </td>
                          <td>{event.categoryName}</td>
                          <td>{event.tags.map((t) => t + ', ')}</td>
                          <td>{event.cityName}</td>
                          <td>{moment(event.startDate).format(timingHelper.defaultDateFormat)}</td>
                          <td>{moment(event.endDate).format(timingHelper.defaultDateFormat)}</td>
                          <td>
                            {moment(event.creationTime).format(timingHelper.defaultDateFormat)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <SearchComponent
                  placeHolder={L('eventSearchPlaceHolder')}
                  onSearch={(value: string) => {
                    this.setState({ runningKeyword: value }, () => {
                      this.updateRunningEventsList(
                        this.state.runningMeta.pageSize,
                        this.state.runningMeta.skipCount
                      );
                    });
                  }}
                />
                <Col xs={24}>
                  <Table
                    className="event-table"
                    pagination={runningPagination}
                    rowKey={(record) => `${record.id}`}
                    loading={this.props.eventStore?.loadingRunningEvents}
                    dataSource={this.props.eventStore?.runningEvents || []}
                    columns={this.eventsTableColumns}
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
                            <b> {L('Category')}: </b>
                            {record.categoryName}
                          </span>
                          <span>
                            <b>{L('EventMainPicture')}:</b>
                            <Image
                              preview={!!record.mainPicture}
                              width={50}
                              height={50}
                              src={record.mainPicture || fallBackImage}
                              alt={L('OrganizerImage')}
                            />
                          </span>

                          <span>
                            <b>{L('TicketPrice')}:</b> {record.price}
                          </span>

                          <span>
                            <b>{L('SubscribersCount')}: </b>
                            {record.bookedSeats}
                          </span>
                          <span>
                            <b> {L('CreationDate')}: </b>
                            {moment(record.creationTime).format(timingHelper.defaultDateFormat)}
                          </span>
                          <span>
                            <b>{L('CreatedBy')}:</b> {record.createdBy}
                          </span>
                        </p>
                      ),
                      rowExpandable: (record) => true,
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Card
              className="dashboardBox"
              title={
                <div>
                  <span>{L('OutdatedEvents')}</span>

                  <a
                    download="outdated-events.xlsx"
                    className="excelBtn"
                    style={{ float: localization.getFloat() }}
                    id="outdatedExport"
                    href="#"
                    onClick={() => {
                      return ExcellentExport.convert(
                        {
                          anchor: document.getElementById('outdatedExport') as HTMLAnchorElement,
                          filename: L('OutdatedEvents'),
                          format: 'xlsx',
                        },
                        [
                          {
                            name: L('OutdatedEvents'),
                            from: {
                              table: document.getElementById(
                                'outdatedDatatable'
                              ) as HTMLTableElement,
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <FileExcelOutlined />
                  </a>
                </div>
              }
              bordered={false}
            >
              <Row>
                <table id="outdatedDatatable" style={{ display: 'none' }}>
                  <thead>
                    <tr>
                      <td>{L('ID')}</td>
                      <td>{L('Title')}</td>
                      <td>{L('About')}</td>
                      <td>{L('Description')}</td>
                      <td>{L('Type')}</td>
                      <td>{L('Category')}</td>
                      <td>{L('Tags')}</td>
                      <td>{L('City')}</td>
                      <td>{L('StartDate')}</td>
                      <td>{L('EndDate')}</td>
                      <td>{L('CreationDate')}</td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.eventStore?.runningEvents.map((event: EventDto, index: number) => {
                      return (
                        <tr key={index}>
                          <td>{event.id}</td>
                          <td>{event.title}</td>
                          <td>{event.about}</td>
                          <td>{event.description}</td>
                          <td>
                            {event.eventType === EventTypes.Free
                              ? L('Free')
                              : event.eventType === EventTypes.Online
                              ? L('Online')
                              : event.eventType === EventTypes.PayWithEnterance
                              ? L('PayWithEnterance')
                              : event.eventType === EventTypes.PayWithSeats
                              ? L('PayWithSeats')
                              : L('Private')}
                          </td>
                          <td>{event.categoryName}</td>
                          <td>{event.tags.map((t) => t + ', ')}</td>
                          <td>{event.cityName}</td>
                          <td>{moment(event.startDate).format(timingHelper.defaultDateFormat)}</td>
                          <td>{moment(event.endDate).format(timingHelper.defaultDateFormat)}</td>
                          <td>
                            {moment(event.creationTime).format(timingHelper.defaultDateFormat)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <SearchComponent
                  placeHolder={L('eventSearchPlaceHolder')}
                  onSearch={(value: string) => {
                    this.setState({ expiredKeyword: value }, () => {
                      this.updateExpiredEventsList(
                        this.state.expiredMeta.pageSize,
                        this.state.expiredMeta.skipCount
                      );
                    });
                  }}
                />
                <Col xs={24}>
                  <Table
                    className="event-table"
                    pagination={expiredpagination}
                    rowKey={(record) => `${record.id}`}
                    loading={this.props.eventStore?.loadingExpiredEvents}
                    dataSource={this.props.eventStore?.expiredEvents || []}
                    columns={this.eventsTableColumns}
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
                            <b> {L('Category')}: </b>
                            {record.categoryName}
                          </span>
                          <span>
                            <b>{L('EventMainPicture')}:</b>
                            <Image
                              preview={!!record.mainPicture}
                              width={50}
                              height={50}
                              src={record.mainPicture || fallBackImage}
                              alt={L('OrganizerImage')}
                            />
                          </span>

                          <span>
                            <b>{L('TicketPrice')}:</b> {record.price}
                          </span>

                          <span>
                            <b>{L('SubscribersCount')}: </b>
                            {record.bookedSeats}
                          </span>
                          <span>
                            <b> {L('CreationDate')}: </b>
                            {moment(record.creationTime).format(timingHelper.defaultDateFormat)}
                          </span>
                          <span>
                            <b>{L('CreatedBy')}:</b> {record.createdBy}
                          </span>
                        </p>
                      ),
                      rowExpandable: (record) => true,
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <EventDetailsModal
          visible={this.state.eventDetailsModalVisible}
          onCancel={() => {
            this.setState({
              eventDetailsModalVisible: false,
            });
            this.props.eventStore!.eventModel = undefined;
          }}
          loading={this.props.eventStore?.isGettingEventData!}
          eventData={this.props.eventStore?.eventModel}
        />
      </>
    );
  }
}

export default Dashboard;
