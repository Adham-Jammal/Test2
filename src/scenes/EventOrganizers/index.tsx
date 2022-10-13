/* eslint-disable */
import * as React from 'react';
import { Card, Table, Tag, Tooltip, Button, Select, Row, Col } from 'antd';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { FormInstance } from 'antd/lib/form';
import {
  LockOutlined,
  EyeOutlined,
  StopOutlined,
  CheckSquareOutlined,
  UpOutlined,
  DownOutlined,
  PlusOutlined,
  EditOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { popupConfirm } from '../../lib/popupMessages';
import EventOrganizerStore from '../../stores/eventOrganizerStore';
import {
  CreateOrUpdateEventOrganizerDto,
  EventOrganizerDto,
} from '../../services/eventOrganizer/dto';
import ResetPasswordModal from '../../components/ResetPasswordModal';
import timingHelper from '../../lib/timingHelper';
import EventOrganizerDetailsModal from './components/EventOrgnizerDetails';
import { isGranted } from '../../lib/abpUtility';
import FiltrationBox from '../../components/FilterationBox';
import CreateOrUpdateEventOrganizer from './components/CreateOrUpdateEventOrganizer';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';
import indexesService from '../../services/indexes/indexesService';
import { IndexType } from '../../lib/types';
import { EntityDto } from '../../services/dto/entityDto';
import localization from '../../lib/localization';
import ExcellentExport from 'excellentexport';
import SearchComponent from '../../components/SearchComponent';

export interface IEventOrganizersProps {
  eventOrganizerStore?: EventOrganizerStore;
}

export interface IEventOrganizersState {
  eventOrganizerModalVisible: boolean;
  resetPasswordModalVisible: boolean;
  eventOrganizerId: number;
  meta: {
    page: number;
    pageSize: number | undefined;
    skipCount: number;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
  };
  permissionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
    resetPassword: boolean;
  };
  keyword?: string;
  isActiveFilter?: boolean;
  eventOrganizerCreateOrUpdateModalVisible: boolean;
  eventOrganizerCreateOrUpdateModalId: number;
  eventOrganizerCreateOrUpdateModalType: string;
  banks: LiteEntityDto[];
}

const INDEX_PAGE_SIZE_DEFAULT = 12;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.EventOrganizerStore)
@observer
export class EventOrganizers extends AppComponentBase<
  IEventOrganizersProps,
  IEventOrganizersState
> {
  resetPasswordFormRef = React.createRef<FormInstance>();

  state = {
    eventOrganizerModalVisible: false,
    resetPasswordModalVisible: false,
    eventOrganizerId: 0,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      skipCount: 0,
      total: 0,
    },
    permissionsGranted: {
      update: false,
      create: false,
      activation: false,
      resetPassword: false,
    },
    keyword: undefined,
    isActiveFilter: undefined,
    eventOrganizerCreateOrUpdateModalVisible: false,
    eventOrganizerCreateOrUpdateModalId: 0,
    eventOrganizerCreateOrUpdateModalType: 'create',
    banks: [],
  };

  // set the state of permissions
  async componentDidMount(): Promise<void> {
    const result = await indexesService.getAllLite({
      maxResultCount: 100,
      skipCount: 0,
      type: IndexType.Bank,
    });
    this.setState({
      banks: result.items,
      permissionsGranted: {
        update: isGranted('EventOrganizers.Update'),
        create: isGranted('EventOrganizers.Create'),
        activation: isGranted('EventOrganizers.Activation'),
        resetPassword: isGranted('EventOrganizers.ResetPassword'),
      },
    });

    await this.updateEventOrganizersList(this.state.meta.pageSize, 0);
  }

  // update the event organizers list
  updateEventOrganizersList = async (maxResultCount: number, skipCount: number): Promise<void> => {
    const { eventOrganizerStore } = this.props!;
    eventOrganizerStore!.maxResultCount = maxResultCount;
    eventOrganizerStore!.skipCount = skipCount;
    eventOrganizerStore!.isActiveFilter = this.state.isActiveFilter;
    eventOrganizerStore!.keyword = this.state.keyword;
    eventOrganizerStore!.getEventOrganizers();
    eventOrganizerStore!.getEventOrganizersForExport();
  };

  // open event organizers reset password modal
  openResetPasswordModal = (eventOrganizerId: number): void => {
    this.setState({ eventOrganizerId, resetPasswordModalVisible: true });
  };

  // open event organizer details modal
  openEventOrganizerDetailsModal = async (organizerId: number): Promise<void> => {
    const { eventOrganizerStore } = this.props!;
    await eventOrganizerStore!.getEventOrganizer({ id: organizerId });
    this.setState({ eventOrganizerModalVisible: true });
  };

  async openCreateOrUpdateModal(entityDto: EntityDto) {
    this.props.eventOrganizerStore!.organizerData = undefined;
    if (entityDto.id === 0) {
      this.setState({
        eventOrganizerCreateOrUpdateModalVisible:
          !this.state.eventOrganizerCreateOrUpdateModalVisible,
        eventOrganizerCreateOrUpdateModalType: 'create',
        eventOrganizerCreateOrUpdateModalId: entityDto.id,
      });
    } else {
      await this.props.eventOrganizerStore!.getEventOrganizer(entityDto);
      this.setState({
        eventOrganizerCreateOrUpdateModalVisible:
          !this.state.eventOrganizerCreateOrUpdateModalVisible,
        eventOrganizerCreateOrUpdateModalType: 'update',
        eventOrganizerCreateOrUpdateModalId: entityDto.id,
      });
    }
  }

  // event organizer activation and deactivation
  onSwitchOrganizerActivation = async (organizer: EventOrganizerDto): Promise<void> => {
    popupConfirm(
      async () => {
        if (organizer.isActive) {
          await this.props.eventOrganizerStore!.organizerDeactivation({ id: organizer.id! });
        } else await this.props.eventOrganizerStore!.organizerActivation({ id: organizer.id! });
        await this.updateEventOrganizersList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      organizer.isActive
        ? L('AreYouSureYouWantToBlockThisEventOrganizer')
        : L('AreYouSureYouWantToActivateThisEventOrganizer')
    );
  };

  // event Organizers Table Columns
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
      title: L('Status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: number): JSX.Element => (
        <Tag color={isActive ? 'green' : 'volcano'} className="ant-tag-disable-pointer">
          {isActive ? L('Active') : L('Inactive')}
        </Tag>
      ),
    },

    {
      title: L('Action'),
      key: 'action',
      render: (_1: unknown, item: EventOrganizerDto): JSX.Element => {
        const {
          permissionsGranted: { update, resetPassword, activation },
        } = this.state;
        return (
          <div>
            {update && (
              <Tooltip title={L('Edit')}>
                <EditOutlined
                  className="action-icon "
                  onClick={() => this.openCreateOrUpdateModal({ id: item.id! })}
                />
              </Tooltip>
            )}
            {activation && item.isActive && (
              <Tooltip title={L('Block')}>
                <StopOutlined
                  className="action-icon red-text"
                  onClick={() => this.onSwitchOrganizerActivation(item)}
                />
              </Tooltip>
            )}
            {activation && !item.isActive && (
              <Tooltip title={L('Activate')}>
                <CheckSquareOutlined
                  className="action-icon  green-text"
                  onClick={() => this.onSwitchOrganizerActivation(item)}
                />
              </Tooltip>
            )}
            <Tooltip title={L('Details')}>
              <EyeOutlined
                className="action-icon "
                onClick={() => this.openEventOrganizerDetailsModal(item.id!)}
              />
            </Tooltip>
            {resetPassword && (
              <Tooltip title={L('ResetPassword')}>
                <LockOutlined
                  className="action-icon"
                  onClick={() => this.openResetPasswordModal(item.id!)}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: number, pageSize: number): Promise<void> => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateEventOrganizersList(pageSize, 0);
    },
    onChange: async (page: number): Promise<void> => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateEventOrganizersList(
        this.state.meta.pageSize,
        (page - 1) * this.state.meta.pageSize
      );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: number, range: number[]): string =>
      `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const {
      eventOrganizers,
      loadingOrganizers,
      organizerData,
      isGettingOrganizerData,
      totalCount,
    } = this.props.eventOrganizerStore!;
    const {
      meta: { page, pageSize },
      isActiveFilter,
    } = this.state;
    const pagination = {
      ...this.paginationOptions,
      total: totalCount,
      current: page,
      pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('EventOrganizers')}</span>
            {this.state.permissionsGranted.create && (
              <Button
                type="primary"
                style={{ float: localization.getFloat() }}
                icon={<PlusOutlined />}
                onClick={() => this.openCreateOrUpdateModal({ id: 0 })}
              >
                {L('AddEventOrganizer')}
              </Button>
            )}
            {!this.props.eventOrganizerStore!.loadingEventOrganizersForExport && (
              <a
                download="event-organizers.xlsx"
                className="ant-btn ant-btn-default export-btn"
                style={{ float: localization.getFloat(), margin: '0 5px' }}
                id="export"
                href="#"
                onClick={() => {
                  return ExcellentExport.convert(
                    {
                      anchor: document.getElementById('export') as HTMLAnchorElement,
                      filename: L('EventOrganizers'),
                      format: 'xlsx',
                    },
                    [
                      {
                        name: L('EventOrganizers'),
                        from: { table: document.getElementById('datatable') as HTMLTableElement },
                      },
                    ]
                  );
                }}
              >
                <FileExcelOutlined /> {L('ExportToExcel')}
              </a>
            )}
          </div>
        }
      >
        <table id="datatable" style={{ display: 'none' }}>
          <thead>
            <tr>
              <td>{L('ID')}</td>
              <td>{L('Name')}</td>
              <td>{L('Surname')}</td>
              <td>{L('UserName')}</td>
              <td>{L('Email')}</td>
              <td>{L('PhoneNumber')}</td>
              <td>{L('companyWebsite')}</td>
              <td>{L('BankAccountNumber')}</td>
              <td>{L('bankName')}</td>
              <td>{L('Status')}</td>
              <td>{L('RegistrationDate')}</td>
            </tr>
          </thead>
          <tbody>
            {this.props.eventOrganizerStore!.eventOrganizersForExpoert.length > 0 &&
              this.props.eventOrganizerStore!.eventOrganizersForExpoert.map(
                (eventOrganizer: EventOrganizerDto, index: number) => {
                  return (
                    <tr key={index}>
                      <td>{eventOrganizer.id}</td>
                      <td>{eventOrganizer.name}</td>
                      <td>{eventOrganizer.surname}</td>
                      <td>{eventOrganizer.userName}</td>
                      <td>{eventOrganizer.emailAddress}</td>
                      <td>{eventOrganizer.countryCode + '' + eventOrganizer.phoneNumber}</td>
                      <td>{eventOrganizer.companyWebsite}</td>
                      <td>{eventOrganizer.accountNumber}</td>
                      <td>{eventOrganizer.bankName}</td>

                      <td>{eventOrganizer.isActive ? L('Active') : L('Inactive')}</td>
                      <td>
                        {moment(eventOrganizer.registrationDate).format(
                          timingHelper.defaultDateFormat
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
          </tbody>
        </table>
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateEventOrganizersList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />
        <FiltrationBox>
          <Row>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
              xl={{ span: 8 }}
            >
              <label>{L('IsActive')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                optionFilterProp="children"
                onChange={(value: boolean) => {
                  this.setState({
                    isActiveFilter: value,
                  });
                }}
                placeholder={L('SelectStatus')}
                value={isActiveFilter}
              >
                <Select.Option key={0} value={true}>
                  {L('Active')}
                </Select.Option>
                <Select.Option key={1} value={false}>
                  {L('Inactive')}
                </Select.Option>
              </Select>
            </Col>
          </Row>
          <div className="btns-wrap">
            <Button
              type="primary"
              onClick={async () => {
                await this.updateEventOrganizersList(
                  this.state.meta.pageSize,
                  this.state.meta.skipCount
                );
              }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ isActiveFilter: undefined }, async () => {
                  await this.updateEventOrganizersList(
                    this.state.meta.pageSize,
                    this.state.meta.skipCount
                  );
                });
              }}
            >
              {L('ResetFilter')}
            </Button>
          </div>
        </FiltrationBox>
        <Table
          pagination={pagination}
          rowKey={(record) => `${record.id}`}
          loading={loadingOrganizers}
          dataSource={eventOrganizers ?? []}
          columns={this.eventOrganizersTableColumns}
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
                  <b> {L('Email')}: </b>
                  {record.emailAddress}
                </span>
                <span>
                  <b> {L('PhoneNumber')}: </b>
                  {record.countryCode ? record.countryCode : '' + '' + record.phoneNumber}
                </span>
                <span>
                  <b> {L('RegistrationDate')}: </b>
                  {moment(record.registrationDate).format(timingHelper.defaultDateFormat)}
                </span>
              </p>
            ),
            rowExpandable: (record) => true,
          }}
        />

        <EventOrganizerDetailsModal
          visible={this.state.eventOrganizerModalVisible}
          onCancel={() =>
            this.setState({
              eventOrganizerModalVisible: false,
            })
          }
          organizerData={organizerData}
          isGettingData={isGettingOrganizerData}
        />

        <CreateOrUpdateEventOrganizer
          isSubmittingEventOrganizer={this.props.eventOrganizerStore?.isSubmittingOrganizer!}
          modalType={this.state.eventOrganizerCreateOrUpdateModalType}
          onCancel={() =>
            this.setState({
              eventOrganizerCreateOrUpdateModalVisible: false,
            })
          }
          onOk={async (values: CreateOrUpdateEventOrganizerDto) => {
            if (this.state.eventOrganizerCreateOrUpdateModalType === 'update') {
              await this.props.eventOrganizerStore?.updateEventOrganizer(values);
            } else {
              await this.props.eventOrganizerStore?.CreateEventOrganizer(values);
            }
            await this.updateEventOrganizersList(
              this.state.meta.pageSize,
              this.state.meta.skipCount
            );
            this.props.eventOrganizerStore!.organizerData = undefined;

            this.setState({
              eventOrganizerCreateOrUpdateModalVisible: false,
            });
          }}
          banks={this.state.banks}
          visible={this.state.eventOrganizerCreateOrUpdateModalVisible}
          eventOrganizerData={
            this.state.eventOrganizerCreateOrUpdateModalType === 'update'
              ? organizerData
              : undefined
          }
          isGettingData={isGettingOrganizerData}
        />
        <ResetPasswordModal
          formRef={this.resetPasswordFormRef}
          isOpen={this.state.resetPasswordModalVisible}
          userId={this.state.eventOrganizerId}
          onClose={() =>
            this.setState({
              resetPasswordModalVisible: false,
            })
          }
        />
      </Card>
    );
  }
}

export default EventOrganizers;
