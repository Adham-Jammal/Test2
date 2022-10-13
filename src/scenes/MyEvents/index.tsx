/* eslint-disable */

import * as React from 'react';
import { Button, Card, Table, Tag, Select, Row, Col, Tooltip, Image } from 'antd';
import { inject, observer } from 'mobx-react';
import {
  CheckSquareOutlined,
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { FormInstance } from 'antd/lib/form';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import EventStore from '../../stores/eventStore';
import { CreateOrUpdateEventDto } from '../../services/events/dto/createOrUpdateEventDto';
import { EventDto } from '../../services/events/dto/eventDto';
import EventDetailsModal from './components/eventDetailsModal';
import CreateOrUpdateEvent from './components/CreateOrUpdateEvent';
import SearchComponent from '../../components/SearchComponent';
import FiltrationBox from '../../components/FilterationBox';
import EventCategoriesService from '../../services/eventCategory/eventCategoriesService';
import EventOrganizersService from '../../services/eventOrganizer/index';

import ChangeStatusModal from '../../components/ChangeStatusModal';
import { fallBackImage } from '../../constants';
import timingHelper from '../../lib/timingHelper';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';
import { EntityDto } from '../../services/dto/entityDto';
import LocationService from '../../services/locations/locationsService';

import './index.css';
import { ShopDto } from '../../services/shops/dto/shopDto';
import { EventType, LocationType } from '../../lib/types';
import ConfigurationsStore from '../../stores/configurationsStore';

// eslint-disable-next-line no-shadow
enum IsActiveStatus {
  Inactive = 0,
  Active = 1,
  Closed = 2,
}

export interface IEventsProps {
  eventStore: EventStore;
  configurationsStore?: ConfigurationsStore;
}

export interface IEventsState {
  eventModalVisible: boolean;
  eventsModalId: number;
  eventModalType: string;
  eventOrganizers?: LiteEntityDto[];
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  eventDetailsModalVisible: boolean;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  statusFilter?: number;
  categoryFilter?: number;
  typeFilter?: EventType;
  keyword?: string;
  openSortEventsModal: boolean;
  eventModalId: number;
  eventModalOldStatus: number;
  changeStatusModalVisible: boolean;
  eventData?: EventDto;
  eventDetailsData?: EventDto;
  eventCatagories: any[];
}

const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 6 },
  xl: { span: 6 },
  xxl: { span: 6 },
};

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.EventStore, Stores.ConfigurationsStore)
@observer
export class Events extends AppComponentBase<IEventsProps, IEventsState> {
  formRef = React.createRef<FormInstance>();

  changeStatusFormRef = React.createRef<FormInstance>();

  cities: LiteEntityDto[] = [];

  state = {
    eventModalVisible: false,
    eventsModalId: 0,
    eventModalType: 'create',
    eventDetailsModalVisible: false,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',

    statusFilter: undefined,
    categoryFilter: undefined,
    typeFilter: undefined,
    keyword: undefined,
    openSortEventsModal: false,
    changeStatusModalVisible: false,
    eventModalId: 0,
    eventModalOldStatus: 0,
    eventData: undefined,
    eventDetailsData: undefined,
    eventCatagories: [],
    eventOrganizers: [],
  };
  shopInfo: ShopDto | undefined = undefined;

  // check the permission granted to user when the comp is mount
  async componentDidMount() {
    await this.props.configurationsStore?.getConfigurations();
    const [eventCategoriesData, citiesData, eventOrganizers] = await Promise.all([
      EventCategoriesService.getAll({ maxResultCount: 100, skipCount: 0, isActive: true }),
      LocationService.getAllLite({ type: LocationType.City }),
      EventOrganizersService.getAllLite({ isActive: true, maxResultCount: 100, skipCount: 0 }),
    ]);
    this.cities = citiesData.items;
    this.setState({
      eventCatagories: eventCategoriesData.items,
      eventOrganizers: eventOrganizers.items,
    });
    this.updateEventsList(this.state.meta.pageSize, 0);
  }

  // update event list based on different properties
  async updateEventsList(maxResultCount: number, skipCount: number, sorting?: string) {
    this.props.eventStore!.maxResultCount = maxResultCount;
    this.props.eventStore!.skipCount = skipCount;
    this.props.eventStore!.eventType = this.state.typeFilter;
    this.props.eventStore!.statusFilter = this.state.statusFilter;
    this.props.eventStore!.categoryFilter = this.state.categoryFilter;
    this.props.eventStore!.keyword = this.state.keyword;
    this.props.eventStore!.onlyMyEvents = true;
    this.props.eventStore!.sorting = sorting;
    this.props.eventStore!.getEvents();
  }

  // handle open event modal
  async openEventModal(entity?: EntityDto) {
    if (entity) {
      this.props.eventStore!.getEvent(entity);
      this.setState({
        eventModalVisible: !this.state.eventModalVisible,
        eventModalType: 'update',
      });
    } else {
      this.setState({
        eventModalVisible: !this.state.eventModalVisible,
        eventModalType: 'create',
      });
    }
  }

  // handle open event details modal
  async openEventDetailsModal(entity: EntityDto) {
    this.props.eventStore!.getEvent(entity);
    await this.props.eventStore!.getSchedules({
      parentId: entity.id,
      skipCount: 0,
      maxResultCount: 4,
    });
    this.setState({
      eventDetailsModalVisible: !this.state.eventDetailsModalVisible,
    });
  }

  createOrUpdateEvent = async (values: CreateOrUpdateEventDto): Promise<number> => {
    values.id === undefined
      ? await this.props.eventStore!.createEvent(values)
      : await this.props.eventStore!.updateEvent(values);
    await this.updateEventsList(this.state.meta.pageSize, this.state.meta.skipCount);
    this.setState({ eventData: undefined });
    return this.props.eventStore.selectedEvent?.id!;
  };

  openChangeStatusModal(id: number, oldStatus: number) {
    this.setState({
      eventModalId: id,
      eventModalOldStatus: oldStatus,
      changeStatusModalVisible: true,
    });
  }

  doneClassificationChangeStatus = () => {
    this.updateEventsList(this.state.meta.pageSize, 0);
  };

  eventStatus = {
    0: {
      value: IsActiveStatus.Inactive,
      text: L('Inactive'),
      color: 'red',
    },
    1: {
      value: IsActiveStatus.Active,
      text: L('Active'),
      color: 'green',
    },
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
        item.schedules.length === 0
          ? `${moment(item.startDate).format(timingHelper.defaultDateFormat)}-${moment(
              item.fromHour
            ).format(timingHelper.defaultTimeFormat)} ${L('To')} ${moment(item.endDate).format(
              timingHelper.defaultDateFormat
            )}-${moment(item.toHour).format(timingHelper.defaultTimeFormat)} `
          : L('RecuuringEvent'),
    },

    {
      title: L('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: number): JSX.Element => (
        <>
          {this.eventStatus[String(status)] && (
            <Tag color={this.eventStatus[String(status)].color} className="ant-tag-disable-pointer">
              {this.eventStatus[String(status)].text}
            </Tag>
          )}
        </>
      ),
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
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon"
                onClick={() => this.openEventModal({ id: item.id! })}
              />
            </Tooltip>
            <Tooltip title={L('ChangeStatus')}>
              <CheckSquareOutlined
                className="action-icon"
                onClick={() => this.openChangeStatusModal(item.id!, item.status)}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  // handle change of sorter
  handleTableChange = (_1: any, _2: any, sorter: any): void => {
    if (sorter.order === 'ascend') {
      this.updateEventsList(this.state.meta.pageSize, 0, `${sorter.columnKey} ASC`);
    } else if (sorter.order === 'descend') {
      this.updateEventsList(this.state.meta.pageSize, 0, `${sorter.columnKey} DESC`);
    } else {
      this.updateEventsList(this.state.meta.pageSize, 0);
    }
  };

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateEventsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateEventsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  compare = (a: any, b: any) => {
    if (a.order < b.order) {
      return -1;
    }
    if (a.order > b.order) {
      return 1;
    }
    return 0;
  };

  public render() {
    const { events, eventModel, isSubmittingEvent, isGettingEventData } = this.props.eventStore!;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.eventStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    const {
      changeStatusModalVisible,
      eventModalId,
      eventModalOldStatus,
      eventModalType,
      eventModalVisible,
      eventCatagories,
      categoryFilter,
      statusFilter,
      eventDetailsModalVisible,
      eventOrganizers,
    } = this.state;
    return (
      <Card
        title={
          <div className="events-page-head">
            <span>{L('Events')}</span>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => this.openEventModal()}>
              {L('AddEvent')}
            </Button>
          </div>
        }
      >
        <SearchComponent
          placeHolder={L('eventSearchPlaceHolder')}
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateEventsList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />

        {/* filter box based on status and category */}
        <FiltrationBox>
          <Row>
            <Col {...colLayout}>
              <label>{L('Status')}</label>
              <Select
                className="filter-select"
                showSearch
                optionFilterProp="children"
                onChange={(value: number) => {
                  this.setState({
                    statusFilter: value === 3 ? undefined : value,
                  });
                }}
                value={statusFilter === undefined ? 3 : statusFilter}
              >
                <Select.Option key={0} value={0}>
                  {L('Inactive')}
                </Select.Option>
                <Select.Option key={1} value={1}>
                  {L('Active')}
                </Select.Option>
                <Select.Option key={3} value={3}>
                  {L('All')}
                </Select.Option>
              </Select>
            </Col>

            <Col {...colLayout} className="category-select">
              <label>{L('Category')}</label>
              <Select
                className="filter-select"
                optionFilterProp="children"
                onChange={(value: number) => {
                  this.setState({
                    categoryFilter: value,
                  });
                }}
                placeholder={L('chooseCategory')}
                value={categoryFilter}
              >
                {eventCatagories &&
                  eventCatagories.length > 0 &&
                  eventCatagories.map((event: any) => (
                    <Select.Option key={event.id} value={event.id}>
                      {event.name}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
          </Row>

          <div className="btns-wrap">
            <Button
              type="primary"
              onClick={async () => {
                await this.updateEventsList(this.state.meta.pageSize, this.state.meta.skipCount);
              }}
              className="filter-btn"
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ statusFilter: undefined, categoryFilter: undefined }, async () => {
                  await this.updateEventsList(this.state.meta.pageSize, this.state.meta.skipCount);
                });
              }}
            >
              {L('ResetFilter')}
            </Button>
          </div>
        </FiltrationBox>

        <Table
          className="event-table"
          pagination={pagination}
          rowKey={(record) => `${record.id}`}
          loading={this.props.eventStore?.loadingEvents}
          dataSource={events || []}
          columns={this.eventsTableColumns}
          onChange={this.handleTableChange}
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
        {/*  create or update event modal */}
        {eventModalVisible && (
          <CreateOrUpdateEvent
            eventOrganizers={eventOrganizers}
            cities={this.cities}
            visible={eventModalVisible}
            onCancel={() =>
              this.setState({
                eventModalVisible: false,
                eventData: undefined,
              })
            }
            modalType={eventModalType}
            onOk={this.createOrUpdateEvent}
            isSubmittingEvent={isSubmittingEvent}
            isGettingData={this.props.eventStore?.isGettingEventData}
            eventData={eventModel}
            feesPercentage={this.props.configurationsStore?.configurations?.percentage!}
            eventCategories={eventCatagories}
          />
        )}

        {/*  event details modal */}
        <EventDetailsModal
          visible={eventDetailsModalVisible}
          onCancel={() => {
            this.setState({
              eventDetailsModalVisible: false,
            });
            this.props.eventStore!.eventModel = undefined;
          }}
          loading={isGettingEventData}
          eventData={eventModel}
        />
        {/* change event status modal */}
        <ChangeStatusModal
          formRef={this.changeStatusFormRef}
          isOpen={changeStatusModalVisible}
          id={eventModalId}
          oldStatus={eventModalOldStatus}
          service="Event"
          onDone={this.doneClassificationChangeStatus}
          options={Object.values(this.eventStatus)}
          onClose={() =>
            this.setState({
              changeStatusModalVisible: false,
            })
          }
        />
      </Card>
    );
  }
}

export default Events;
