/* eslint-disable */
import React from 'react';
import { Card, Button, Tooltip, Table, Tag, Row, Col, Select, DatePicker } from 'antd';
import moment from 'moment';
import {
  PlusOutlined,
  EyeOutlined,
  StopOutlined,
  CheckSquareOutlined,
  EditOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import FiltrationBox from '../../components/FilterationBox';
import { L } from '../../i18next';
import AppComponentBase from '../../components/AppComponentBase';
import { AzkarDto, CreateOrUpdateAzkarDto } from '../../services/azkar/dto';
import AzkarStore from '../../stores/AzkarStore';
import timingHelper from '../../lib/timingHelper';
import { popupConfirm } from '../../lib/popupMessages';
import SearchComponent from '../../components/SearchComponent';
import CreateOrUpdateAzkarModal from './components/CreateOrUpdateModal';
import AzkarDetails from './components/AzkarDetails';
import { isGranted } from '../../lib/abpUtility';

import './index.less';
import { AzkarCategory } from '../../lib/types';

// event list props types
export interface IEventsProps {
  azkarStore: AzkarStore;
}
// event list state types
export interface IEventsState {
  azkarModalVisible: boolean;
  azkarModalType: string;
  azkarDetailsModalVisible: boolean;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  statusFilter?: boolean;
  categoryFilter?: number;
  minCreationTime?: string;
  maxCreationTime?: string;
  permissionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
  };
  keyword?: string;
  azkarData?: AzkarDto;
  azkarDetailsData?: AzkarDto;
}
// pages default options
const INDEX_PAGE_SIZE_DEFAULT = 15;
const INDEX_PAGE_SIZE_OPTIONS = ['15', '30', '35', '50', '65'];

// col layout for sorter
const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 12 },
  xl: { span: 8 },
  xxl: { span: 8 },
};

@inject(Stores.AzkarStore)
@observer
export class RelegionAzkar extends AppComponentBase<IEventsProps, IEventsState> {
  // azkar state
  state = {
    azkarModalVisible: false,
    azkarDetailsModalVisible: false,
    azkarModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    permissionsGranted: {
      update: false,
      create: false,
      activation: false,
    },
    keyword: undefined,
    azkarData: undefined,
    azkarDetailsData: undefined,
    statusFilter: undefined,
    categoryFilter: undefined,
    minCreationTime: undefined,
    maxCreationTime: undefined,
  };

  // check the permission granted to user when the comp is mount
  async componentDidMount() {
    this.setState({
      permissionsGranted: {
        update: isGranted('Events.Update'),
        create: isGranted('Events.Create'),
        activation: isGranted('Events.Activation'),
      },
    });
    this.updateAzkarList(this.state.meta.pageSize, 0);
  }

  // open azkar add or edit modal
  openAzkarModal = (data?: AzkarDto): void => {
    if (data) {
      this.setState({
        azkarData: data,
        azkarModalVisible: true,
        azkarModalType: 'update',
      });
    } else {
      this.setState({
        azkarModalVisible: true,
        azkarModalType: 'create',
        azkarData: undefined,
      });
    }
  };

  // handle delete azkar modal
  onDeleteAzkar = async (id: number) => {
    popupConfirm(async () => {
      await this.props.azkarStore!.AzkarDelete({ id });
      await this.updateAzkarList(this.state.meta.pageSize, this.state.meta.skipCount);
    }, L('AreYouSureYouWantToDeleteThisAzkar'));
  };

  // open azkar add or edit modal
  openAzkarDetailsModal = (data: AzkarDto): void => {
    this.setState({
      azkarDetailsModalVisible: true,
      azkarDetailsData: data,
    });
  };

  // open azkar add or edit modal
  changeStatus = async (id: number, status: boolean) => {
    popupConfirm(
      async () => {
        if (!status) {
          await this.props.azkarStore!.AzkarActivation({ id });
        } else {
          await this.props.azkarStore!.AzkarDeActivation({ id });
        }
        await this.updateAzkarList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      status
        ? L('AreYouSureYouWantToDeactivateThisAzkar')
        : L('AreYouSureYouWantToActivateThisAzkar')
    );
  };

  // update azkar list based on different properties
  async updateAzkarList(
    maxResultCount: number,
    skipCount: number,
    sorting?: string
  ): Promise<void> {
    const { keyword, statusFilter, categoryFilter, minCreationTime, maxCreationTime } = this.state;
    this.props.azkarStore!.maxResultCount = maxResultCount;
    this.props.azkarStore!.skipCount = skipCount;
    this.props.azkarStore!.keyword = keyword;
    this.props.azkarStore!.IsActive = statusFilter;
    this.props.azkarStore!.categoryFilter = categoryFilter;
    this.props.azkarStore!.minCreationTime = minCreationTime;
    this.props.azkarStore!.maxCreationTime = maxCreationTime;
    this.props.azkarStore!.sorting = sorting;
    this.props.azkarStore!.getAzkar();
  }

  // handle change of sorter
  handleTableChange = (_1: any, _2: any, sorter: any): void => {
    if (sorter.order === 'ascend') {
      this.updateAzkarList(this.state.meta.pageSize, 0, `${sorter.columnKey} ASC`);
    } else if (sorter.order === 'descend') {
      this.updateAzkarList(this.state.meta.pageSize, 0, `${sorter.columnKey} DESC`);
    } else {
      this.updateAzkarList(this.state.meta.pageSize, 0);
    }
  };

  // azkar catagories
  catagories = {
    0: L('morning'),
    1: L('evening'),
    2: L('afterPrayer'),
  };

  // azkar columns  data
  azkarTableColumns = [
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
      title: L('DateRange'),
      dataIndex: 'fromDate',
      key: 'fromDate',
      render: (fromDate: Date, item: AzkarDto): JSX.Element => (
        <>
          {`${moment(fromDate).format(timingHelper.defaultDateFormat)} - ${moment(
            item.toDate
          ).format(timingHelper.defaultDateFormat)} `}
        </>
      ),
    },

    {
      title: L('Status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: number): JSX.Element => (
        <>
          {isActive ? (
            <Tag color="green">{L('Active')}</Tag>
          ) : (
            <Tag color="red">{L('Inactive')}</Tag>
          )}
        </>
      ),
    },
    {
      title: L('Action'),
      key: 'action',
      render: (_: string, item: AzkarDto): JSX.Element => {
        const { permissionsGranted } = this.state;
        return (
          <div>
            <Tooltip title={L('Details')}>
              <EyeOutlined
                className="action-icon"
                onClick={() => this.openAzkarDetailsModal(item)}
              />
            </Tooltip>
            {permissionsGranted.update && (
              <Tooltip title={L('Edit')}>
                <EditOutlined className="action-icon" onClick={() => this.openAzkarModal(item)} />
              </Tooltip>
            )}
            <Tooltip title={L('Delete')}>
              <DeleteOutlined className="action-icon" onClick={() => this.onDeleteAzkar(item.id)} />
            </Tooltip>
            {permissionsGranted.activation && item.isActive && (
              <Tooltip title={L('Deactivate')}>
                <StopOutlined
                  className="action-icon  red-text"
                  onClick={() => this.changeStatus(item.id, item.isActive)}
                />
              </Tooltip>
            )}
            {permissionsGranted.activation && !item.isActive && (
              <Tooltip title={L('Activate')}>
                <CheckSquareOutlined
                  className="action-icon green-text"
                  onClick={() => this.changeStatus(item.id, item.isActive)}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  // table paginationOptions

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (_: number, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateAzkarList(pageSize, 0);
    },
    onChange: async (page: number) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateAzkarList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: number, range: number[]) =>
      `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  // handle submit create or update modal
  onOk = async (values: CreateOrUpdateAzkarDto) => {
    const { azkarModalType } = this.state;
    if (azkarModalType === 'create') {
      await this.props.azkarStore!.createAzkar(values);
    } else {
      await this.props.azkarStore!.updateAzkar(values);
    }
    await this.updateAzkarList(this.state.meta.pageSize, this.state.meta.skipCount);
    this.setState({ azkarModalVisible: false, azkarData: undefined });
  };

  public render() {
    const { azkar, totalCount, loadingAzkar, isSubmittingAzkar } = this.props.azkarStore! || {};
    const {
      meta: { page, pageSize },
      azkarModalVisible,
      azkarModalType,
      azkarData,
      azkarDetailsData,
      azkarDetailsModalVisible,
      statusFilter,
      categoryFilter,
      minCreationTime,
      maxCreationTime,
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
          <div className="page-head">
            <span>{L('religionAzkar')}</span>
            {this.state.permissionsGranted.create && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => this.openAzkarModal()}>
                {L('addAzkar')}
              </Button>
            )}
          </div>
        }
      >
        {/* Search Component */}
        <SearchComponent
          placeHolder={L('azkarSearchPlaceHolder')}
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateAzkarList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />

        {/* filter box based on status and category */}
        <FiltrationBox>
          <Row gutter={[15, 20]}>
            <Col {...colLayout}>
              <label>{L('Status')}</label>
              <Select
                className="filter-select"
                showSearch
                optionFilterProp="children"
                placeholder={L('selectStatus')}
                onChange={(value?: boolean) => {
                  this.setState({
                    statusFilter: value,
                  });
                }}
                value={statusFilter}
              >
                <Select.Option value={false}>{L('Inactive')}</Select.Option>
                {/* eslint-disable-next-line react/jsx-boolean-value */}
                <Select.Option value={true}>{L('Active')}</Select.Option>
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
                <Select.Option value={AzkarCategory.Morning}>{L('morning')}</Select.Option>
                <Select.Option value={AzkarCategory.Evening}>{L('evening')}</Select.Option>
                <Select.Option value={AzkarCategory.AfterPrayer}>{L('afterPrayer')}</Select.Option>
              </Select>
            </Col>
            <Col {...colLayout} className="date-select">
              <label>{L('minCreationTime')}</label>
              <DatePicker
                format="YYYY-MM-DD"
                value={minCreationTime && moment(minCreationTime)}
                placeholder={L('startTime')}
                onChange={(_, dateString) => {
                  this.setState({ minCreationTime: new Date(dateString).toISOString() });
                }}
              />
            </Col>
            <Col {...colLayout} className="category-select">
              <label>{L('maxCreationTime')}</label>
              <DatePicker
                format="YYYY-MM-DD"
                value={maxCreationTime && moment(maxCreationTime)}
                onChange={(_, dateString) =>
                  this.setState({ maxCreationTime: new Date(dateString).toISOString() })
                }
                placeholder={L('endTime')}
              />
            </Col>
          </Row>

          <div className="btns-wrap">
            <Button
              type="primary"
              onClick={async () => {
                await this.updateAzkarList(this.state.meta.pageSize, this.state.meta.skipCount);
              }}
              className="filter-btn"
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState(
                  {
                    statusFilter: undefined,
                    categoryFilter: undefined,
                    minCreationTime: undefined,
                    maxCreationTime: undefined,
                  },
                  async () => {
                    await this.updateAzkarList(this.state.meta.pageSize, this.state.meta.skipCount);
                  }
                );
              }}
            >
              {L('ResetFilter')}
            </Button>
          </div>
        </FiltrationBox>

        {/* religion azakar table */}
        <Table
          className="azkar-table"
          pagination={pagination}
          rowKey={(record) => `${record.id}`}
          loading={loadingAzkar}
          dataSource={azkar || []}
          columns={this.azkarTableColumns}
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
                  <b>{L('Category')}: </b>
                  {this.catagories[record.category] && this.catagories[record.category]}
                </span>

                <span>
                  <b>{L('CreationDate')}:</b>{' '}
                  {moment(record.creationTime).format(timingHelper.defaultDateFormat)}
                </span>
                <span>
                  <b> {L('CreatedBy')}: </b>
                  {record.createdBy ? record.createdBy : L('NotAvailable')}
                </span>
              </p>
            ),
            rowExpandable: (record) => true,
          }}
        />

        {/* create or update modal  */}
        <CreateOrUpdateAzkarModal
          visible={azkarModalVisible}
          onCancel={() => this.setState({ azkarModalVisible: false, azkarData: undefined })}
          modalType={azkarModalType}
          onOk={this.onOk}
          isSubmittingAzkar={isSubmittingAzkar}
          azkarData={azkarData}
        />
        {/* azkar details modal */}
        <AzkarDetails
          azkarData={azkarDetailsData}
          visible={azkarDetailsModalVisible}
          onCancel={() =>
            this.setState({ azkarDetailsModalVisible: false, azkarDetailsData: undefined })
          }
        />
      </Card>
    );
  }
}
export default RelegionAzkar;
