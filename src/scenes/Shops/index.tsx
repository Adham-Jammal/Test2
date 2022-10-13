/* eslint-disable */
import * as React from 'react';
import { Button, Card, Table, Tag, Select, Tooltip, Row, Col } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import { popupConfirm } from '../../lib/popupMessages';
import SearchComponent from '../../components/SearchComponent';

import localization from '../../lib/localization';
import {
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
  EyeOutlined,
  // DeleteOutlined,
  CheckSquareOutlined,
  StopOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import CreateOrUpdateShop from './components/createOrUpdateShop';
import ShopDetailsModal from './components/shopDetailsModal';
import userService from '../../services/user/userService';
import utils from '../../utils/utils';
import ShopStore from '../../stores/shopStore';
import { CreateOrUpdateShopDto } from '../../services/shops/dto/createShopDto';
import { ShopDto } from '../../services/shops/dto/shopDto';
import FilterationBox from '../../components/FilterationBox';

export interface IShopsProps {
  shopStore?: ShopStore;
}

const filterationColLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 7 },
  xl: { span: 7 },
  xxl: { span: 7 },
};

export interface IShopsState {
  shopModalVisible: boolean;
  resetPasswordModalVisible: boolean;
  shopDetailsModalVisible: boolean;
  shopId: number;
  shopsModalId: number;
  shopsModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    skipCount: number;
    pageTotal: number;
    total: number;
  };
  permisssionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
    delete: boolean;
  };
  isActiveFilter?: boolean;
  keyword?: string;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];
declare var abp: any;

@inject(Stores.ShopStore)
@observer
export class Shops extends AppComponentBase<IShopsProps, IShopsState> {
  formRef = React.createRef<FormInstance>();
  resetPasswordFormRef = React.createRef<FormInstance>();
  currentUser: any = undefined;

  state = {
    shopModalVisible: false,
    resetPasswordModalVisible: false,
    shopDetailsModalVisible: false,
    shopId: 0,
    shopsModalId: 0,
    shopsModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      skipCount: 0,
      pageTotal: 1,
      total: 0,
    },
    permisssionsGranted: {
      update: false,
      create: false,
      activation: false,
      delete: false,
    },
    isActiveFilter: undefined,
    keyword: undefined,
  };

  async componentDidMount() {
    this.currentUser = await userService.get({ id: abp.session.userId });
    this.setState({
      permisssionsGranted: {
        update: (await utils.checkIfGrantedPermission('Shops.Update')).valueOf(),
        create: (await utils.checkIfGrantedPermission('Shops.Create')).valueOf(),
        delete: (await utils.checkIfGrantedPermission('Shops.Delete')).valueOf(),
        activation: (await utils.checkIfGrantedPermission('Shops.Activation')).valueOf(),
      },
    });
    this.updateShopsList(this.state.meta.pageSize, 0);
  }

  async updateShopsList(maxResultCount: number, skipCount: number) {
    this.props.shopStore!.maxResultCount = maxResultCount;
    this.props.shopStore!.skipCount = skipCount;
    this.props.shopStore!.keyword = this.state.keyword;
    this.props.shopStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.shopStore!.getShops();
  }

  async openShopModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.shopStore!.shopModel = undefined;
      this.setState({
        shopsModalType: 'create',
        shopsModalId: entityDto.id,
        shopModalVisible: !this.state.shopModalVisible,
      });
    } else {
      await this.props.shopStore!.getShopFromAPI(entityDto);
      this.setState({
        shopsModalType: 'edit',
        shopsModalId: entityDto.id,
        shopModalVisible: !this.state.shopModalVisible,
      });
    }
  }

  getColumnStatusSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
            this.setState({ isActiveFilter: value === 3 ? undefined : value === 1 ? true : false });
          }}
          value={this.state.isActiveFilter === undefined ? 3 : !this.state.isActiveFilter ? 0 : 1}
        >
          <Select.Option key={1} value={1}>
            {L('Activated')}
          </Select.Option>
          <Select.Option key={0} value={0}>
            {L('Deactivated')}
          </Select.Option>
          <Select.Option key={3} value={3}>
            {L('All')}
          </Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateShopsList(this.state.meta.pageSize, this.state.meta.skipCount);
          }}
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({ isActiveFilter: undefined }, () => {
              this.updateShopsList(this.state.meta.pageSize, this.state.meta.skipCount);
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

  async openShopDetailsModal(entityDto: EntityDto) {
    await this.props.shopStore!.getShopFromAPI(entityDto);
    this.setState({
      shopDetailsModalVisible: !this.state.shopDetailsModalVisible,
      shopsModalId: entityDto.id,
    });
  }

  createOrUpdateShop = async (values: any) => {
    if (this.state.shopsModalId === 0) {
      await this.props.shopStore!.createShop(values as CreateOrUpdateShopDto);
    } else {
      await this.props.shopStore!.updateShop(values as CreateOrUpdateShopDto);
    }
    await this.props.shopStore!.getShops();
    this.props.shopStore!.shopModel = undefined;
    this.setState({ shopModalVisible: false });
  };

  onSwitchShopActivation = async (shop: ShopDto) => {
    popupConfirm(
      async () => {
        if (shop.isActive) await this.props.shopStore!.shopDeactivation({ id: shop.id });
        else await this.props.shopStore!.shopActivation({ id: shop.id });
        await this.updateShopsList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      shop.isActive
        ? L('AreYouSureYouWantToDeactivateThisShop')
        : L('AreYouSureYouWantToActivateThisShop')
    );
  };

  onDeleteShop = async (input: EntityDto) => {
    popupConfirm(async () => {
      await this.props.shopStore!.deleteShop({ id: input.id });
    }, L('AreYouSureYouWantToDeleteThisShop'));
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
      title: L('ManagerEmail'),
      dataIndex: 'managerEmail',
      key: 'managerEmail',
      render: (_: any, item: ShopDto) => {
        return item.manager.emailAddress;
      },
    },
    {
      title: L('Code'),
      dataIndex: 'code',
      key: 'code',
    },

    {
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => {
        return (
          <Tag color={isActive ? 'green' : 'volcano'} className="ant-tag-disable-pointer">
            {isActive ? L('Active') : L('Inactive')}
          </Tag>
        );
      },
      ...this.getColumnStatusSearchProps(),
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
          {this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon "
                onClick={() => this.openShopModal({ id: item.id })}
              />
            </Tooltip>
          ) : null}
          {item.isActive ? (
            this.state.permisssionsGranted.activation ? (
              <Tooltip title={L('Block')}>
                <StopOutlined
                  className="action-icon  red-text"
                  onClick={() => this.onSwitchShopActivation(item)}
                />
              </Tooltip>
            ) : null
          ) : this.state.permisssionsGranted.activation ? (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.onSwitchShopActivation(item)}
              />
            </Tooltip>
          ) : null}
          {/* {this.state.permisssionsGranted.delete ? (
            <Tooltip title={L('Delete')}>
              <DeleteOutlined
                className="action-icon  red-text"
                onClick={() => this.onDeleteShop({ id: item.id })}
              />
            </Tooltip>
          ) : null} */}
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
      this.updateShopsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateShopsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const shops = this.props.shopStore!.shops;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.shopStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Shops')}</span>
            {this.state.permisssionsGranted.create ? (
              <Button
                type="primary"
                style={{ float: localization.getFloat() }}
                icon={<PlusOutlined />}
                onClick={() => this.openShopModal({ id: 0 })}
              >
                {L('AddShop')}
              </Button>
            ) : null}
          </div>
        }
      >
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateShopsList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />
        <FilterationBox>
          <Row>
            <Col {...filterationColLayout} style={{ marginTop: '15px' }}>
              <label>{L('IsActive')}</label>

              <Select
                style={{ display: 'block' }}
                showSearch
                optionFilterProp="children"
                onChange={(value: number) => {
                  this.setState({
                    isActiveFilter: value === 3 ? undefined : value === 1,
                  });
                }}
                value={
                  this.state.isActiveFilter === undefined ? 3 : !this.state.isActiveFilter ? 0 : 1
                }
              >
                <Select.Option key={1} value={1}>
                  {L('Activated')}
                </Select.Option>
                <Select.Option key={0} value={0}>
                  {L('Deactivated')}
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
                await this.updateShopsList(this.state.meta.pageSize, this.state.meta.skipCount);
              }}
              style={{ width: 90 }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState(
                  {
                    isActiveFilter: undefined,
                  },
                  async () => {
                    await this.updateShopsList(this.state.meta.pageSize, this.state.meta.skipCount);
                  }
                );
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
          loading={this.props.shopStore!.loadingShops}
          dataSource={shops === undefined ? [] : shops}
          columns={this.shopsTableColumns}
          expandable={{
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <UpOutlined className="expand-icon" onClick={(e) => onExpand(record, e)} />
              ) : (
                <DownOutlined className="expand-icon" onClick={(e) => onExpand(record, e)} />
              ),
            expandedRowRender: (record) => (
              <p className="expanded-row" style={{ margin: 0 }}>
                {/* <span>
                  <b>{L('PhoneNumber')}: </b>
                  {record.shopCountryCode! + ' ' + record.shopPhoneNumber}
                </span> */}

                <span>
                  <b>{L('City')}:</b> {record.city ? record.city?.text : L('NotAvailable')}
                </span>
                {/* <span>
                  <b> {L('BankAccountNumber')}: </b>
                  {record.accountNumber ? record.accountNumber : L('NotAvailable')}
                </span> */}
              </p>
            ),
            rowExpandable: (record) => true,
          }}
        />

        <CreateOrUpdateShop
          visible={this.state.shopModalVisible}
          onCancel={() =>
            this.setState({
              shopModalVisible: false,
            })
          }
          modalType={this.state.shopsModalType}
          onOk={this.createOrUpdateShop}
          isSubmittingShop={this.props.shopStore!.isSubmittingShop}
          shopData={this.props.shopStore!.shopModel}
          isGettingData={this.props.shopStore?.isGettingShopData!}
        />

        <ShopDetailsModal
          visible={this.state.shopDetailsModalVisible}
          onCancel={() =>
            this.setState({
              shopDetailsModalVisible: false,
            })
          }
          shopStore={this.props.shopStore!}
        />
      </Card>
    );
  }
}

export default Shops;
