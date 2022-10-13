/* eslint-disable */
import * as React from 'react';
import { Button, Card, Tooltip, Table, Tag, Select, Col, Row } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import {
  CheckSquareOutlined,
  DownOutlined,
  EyeOutlined,
  FileExcelOutlined,
  LockOutlined,
  StopOutlined,
  UpOutlined,
} from '@ant-design/icons';
import userService from '../../services/user/userService';
import utils from '../../utils/utils';
import { EntityDto } from '../../services/dto/entityDto';
import ShopManagerStore from '../../stores/shopmanagerStore';
import { FormInstance } from 'antd/lib/form';
import { ShopManagerDto } from '../../services/shopManagers/dto/shopManagerDto';
import moment from 'moment';
import timingHelper from '../../lib/timingHelper';
import ResetPasswordModal from '../../components/ResetPasswordModal';
import SearchComponent from '../../components/SearchComponent';
import ShopManagerDetailsModal from './components/shopManagerDetailsModal';
import FilterationBox from '../../components/FilterationBox';
import { popupConfirm } from '../../lib/popupMessages';
import { UserStatus } from '../../lib/types';
import localization from '../../lib/localization';
import ExcellentExport from 'excellentexport';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';

export interface IShopManagersProps {
  shopManagerStore: ShopManagerStore;
}

const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 6 },
  xl: { span: 6 },
  xxl: { span: 6 },
};

export interface IShopManagersState {
  resetPasswordModalVisible: boolean;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  shopManagerDetailsModalVisible: boolean;

  permisssionsGranted: {
    activation: boolean;
    resetPassword: boolean;
  };
  isActiveFilter?: boolean;
  keyword?: string;
  shopManagerId: number;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];
declare var abp: any;

@inject(Stores.ShopManagerStore)
@observer
export class ShopManagers extends AppComponentBase<IShopManagersProps, IShopManagersState> {
  currentUser: any = undefined;
  resetPasswordFormRef = React.createRef<FormInstance>();

  state = {
    resetPasswordModalVisible: false,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    shopManagerId: 0,
    shopManagerDetailsModalVisible: false,
    permisssionsGranted: {
      activation: false,
      resetPassword: false,
    },
    isActiveFilter: undefined,
    keyword: undefined,
  };

  async openShopManagerDetailsModal(entityDto: EntityDto) {
    await this.props.shopManagerStore!.getShopManager(entityDto);
    this.setState({ shopManagerDetailsModalVisible: !this.state.shopManagerDetailsModalVisible });
  }

  resolveStatus = (status: number) => {
    switch (status) {
      case UserStatus.Active:
        return (
          <Tag color={'green'} className="ant-tag-disable-pointer">
            {L('Active')}
          </Tag>
        );
      case UserStatus.Blocked:
        return (
          <Tag color={'red'} className="ant-tag-disable-pointer">
            {L('Blocked')}
          </Tag>
        );
      case UserStatus.Inactive:
        return (
          <Tag color={'volcano'} className="ant-tag-disable-pointer">
            {L('Inactive')}
          </Tag>
        );
    }
    return null;
  };

  async componentDidMount() {
    this.currentUser = await userService.get({ id: abp.session.userId });
    this.setState({
      permisssionsGranted: {
        activation: (await utils.checkIfGrantedPermission('ShopManagers.Activation')).valueOf(),
        resetPassword: (
          await utils.checkIfGrantedPermission('ShopManagers.ResetPassword')
        ).valueOf(),
      },
    });
    this.updateShopManagersList(this.state.meta.pageSize, 0);
  }

  async updateShopManagersList(maxResultCount: number, skipCount: number) {
    this.props.shopManagerStore!.maxResultCount = maxResultCount;
    this.props.shopManagerStore!.skipCount = skipCount;
    this.props.shopManagerStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.shopManagerStore!.keyword = this.state.keyword;

    this.props.shopManagerStore!.getShopManagers();
    this.props.shopManagerStore!.getShopManagersForExport();
  }

  onSwitchShopManagerActivation = async (shopManager: ShopManagerDto) => {
    popupConfirm(
      async () => {
        if (shopManager.status === UserStatus.Active)
          await this.props.shopManagerStore!.shopManagerDeactivation({ id: shopManager.shopId });
        else await this.props.shopManagerStore!.shopManagerActivation({ id: shopManager.shopId });
      },
      shopManager.status === UserStatus.Active
        ? L('AreYouSureYouWantToBlockThisShopManager')
        : L('AreYouSureYouWantToActivateThisShopManager')
    );
  };

  openResetPasswordModal(shopManagerId: number) {
    this.setState({ shopManagerId: shopManagerId, resetPasswordModalVisible: true });
  }

  shopManagersTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },

    {
      title: L('Email'),
      dataIndex: 'emailAddress',
      key: 'emailAddress',
    },

    {
      title: L('LastLoginTime'),
      dataIndex: 'lastLoginDate',
      key: 'lastLoginDate',
      render: (lastLoginDate: string) => {
        return lastLoginDate
          ? moment(lastLoginDate).format(timingHelper.defaultDateTimeFormat)
          : '';
      },
    },
    {
      title: L('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: UserStatus) => {
        return this.resolveStatus(status);
      },
    },
    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: ShopManagerDto) => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon "
              onClick={() => this.openShopManagerDetailsModal({ id: item.id })}
            />
          </Tooltip>
          {item.status == UserStatus.Active ? (
            this.state.permisssionsGranted.activation ? (
              <Tooltip title={L('Block')}>
                <StopOutlined
                  className="action-icon  red-text"
                  onClick={() => this.onSwitchShopManagerActivation(item)}
                />
              </Tooltip>
            ) : null
          ) : this.state.permisssionsGranted.activation ? (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.onSwitchShopManagerActivation(item)}
              />
            </Tooltip>
          ) : null}
          {this.state.permisssionsGranted.resetPassword ? (
            <Tooltip title={L('ResetPassword')}>
              <LockOutlined
                className="action-icon "
                onClick={() => this.openResetPasswordModal(item.id)}
              />
            </Tooltip>
          ) : null}
        </div>
      ),
    },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateShopManagersList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateShopManagersList(
        this.state.meta.pageSize,
        (page - 1) * this.state.meta.pageSize
      );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const shopManagers = this.props.shopManagerStore!.shopManagers;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.shopManagerStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <>
            <span>{L('ShopManagers')}</span>
            {!this.props.shopManagerStore!.loadingShopManagersForExport && (
              <a
                download="admins.xlsx"
                className="ant-btn ant-btn-default export-btn"
                style={{ float: localization.getFloat() }}
                id="export"
                href="#"
                onClick={() => {
                  return ExcellentExport.convert(
                    {
                      anchor: document.getElementById('export') as HTMLAnchorElement,
                      filename: L('ShopManagers'),
                      format: 'xlsx',
                    },
                    [
                      {
                        name: L('ShopManagers'),
                        from: { table: document.getElementById('datatable') as HTMLTableElement },
                      },
                    ]
                  );
                }}
              >
                <FileExcelOutlined /> {L('ExportToExcel')}
              </a>
            )}
          </>
        }
      >
        <table id="datatable" style={{ display: 'none' }}>
          <thead>
            <tr>
              <td>{L('ID')}</td>
              <td>{L('Name')}</td>
              <td>{L('PhoneNumber')}</td>

              <td>{L('Email')}</td>
              <td>{L('City')}</td>
              <td>{L('ShopName')}</td>
              <td>{L('Categories')}</td>
              <td>{L('OrdersCount')}</td>

              <td>{L('ProductsCount')}</td>
              <td>{L('TotalIncome')}</td>

              <td>{L('Status')}</td>
              <td>{L('JoinDate')}</td>
            </tr>
          </thead>
          <tbody>
            {this.props.shopManagerStore!.ShopManagersForExport.length > 0 &&
              this.props.shopManagerStore!.ShopManagersForExport.map(
                (shopManager: ShopManagerDto, index: number) => {
                  return (
                    <tr key={index}>
                      <td>{shopManager.id}</td>
                      <td>{shopManager.ownerName + ' ' + shopManager.ownerSurname}</td>
                      <td>{shopManager.countryCode + '' + shopManager.phoneNumber}</td>
                      <td>{shopManager.emailAddress}</td>
                      <td>{shopManager.city ? shopManager.city.text : L('NotAvailable')}</td>
                      <td>{shopManager.shopName}</td>
                      <td>
                        {shopManager.categories && shopManager.categories.length > 0
                          ? shopManager.categories.map((cat: LiteEntityDto) => cat.text + ', ')
                          : L('NotAvailable')}
                      </td>

                      <td>{shopManager.ordersCount}</td>
                      <td>{shopManager.productsCount}</td>
                      <td>{shopManager.totalIncome}</td>

                      <td>
                        {shopManager.status === UserStatus.Inactive
                          ? L('Inactive')
                          : shopManager.status === UserStatus.Active
                          ? L('Active')
                          : L('Blocked')}
                      </td>
                      <td>{moment(shopManager.joinDate).format(timingHelper.defaultDateFormat)}</td>
                    </tr>
                  );
                }
              )}
          </tbody>
        </table>
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateShopManagersList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />
        <FilterationBox>
          <Row>
            <Col {...colLayout}>
              <label>{L('Status')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                optionFilterProp="children"
                onChange={(value: any) => {
                  this.setState({
                    isActiveFilter: value === 3 ? undefined : value === 1 ? true : false,
                  });
                }}
                value={
                  this.state.isActiveFilter === undefined ? 3 : !this.state.isActiveFilter ? 0 : 1
                }
              >
                <Select.Option key={0} value={0}>
                  {L('Inactive')}
                </Select.Option>
                <Select.Option key={1} value={1}>
                  {L('Active')}
                </Select.Option>
                <Select.Option key={2} value={2}>
                  {L('Blocked')}
                </Select.Option>
                <Select.Option key={3} value={3}>
                  {L('All')}
                </Select.Option>
              </Select>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px' }}>
            <Button
              type="primary"
              onClick={async () => {
                await this.updateShopManagersList(
                  this.state.meta.pageSize,
                  this.state.meta.skipCount
                );
              }}
              style={{ width: 90 }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ isActiveFilter: undefined }, async () => {
                  await this.updateShopManagersList(
                    this.state.meta.pageSize,
                    this.state.meta.skipCount
                  );
                });
              }}
              style={{ width: 90, marginRight: 4, marginLeft: 4 }}
            >
              {L('ResetFilter')}
            </Button>
          </Row>
        </FilterationBox>

        <Table
          pagination={pagination}
          rowKey={(record) => record.id + ''}
          style={{ marginTop: '12px' }}
          loading={this.props.shopManagerStore!.loadingShopManagers}
          dataSource={shopManagers === undefined ? [] : shopManagers}
          columns={this.shopManagersTableColumns}
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
                  <b> {L('ShopName')}: </b>
                  {record.shopName ? record.shopName : L('NotAvailable')}
                </span>
                <span>
                  <b> {L('PhoneNumber')}: </b>
                  {record.phoneNumber}
                </span>
                <span>
                  <b> {L('JoinDate')}: </b>
                  {moment(record.joinDate).format(timingHelper.defaultDateFormat)}
                </span>
              </p>
            ),
            rowExpandable: (record) => true,
          }}
        />

        <ShopManagerDetailsModal
          visible={this.state.shopManagerDetailsModalVisible}
          onCancel={() =>
            this.setState({
              shopManagerDetailsModalVisible: false,
            })
          }
          shopManagerStore={this.props.shopManagerStore!}
        />

        <ResetPasswordModal
          formRef={this.resetPasswordFormRef}
          isOpen={this.state.resetPasswordModalVisible}
          userId={this.state.shopManagerId}
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

export default ShopManagers;
