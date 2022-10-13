/* eslint-disable */
import * as React from 'react';
import { Button, Card, Table, Tag, Select, Row, Col, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import localization from '../../lib/localization';
import moment from 'moment';
import {
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import timingHelper from '../../lib/timingHelper';
import SearchComponent from '../../components/SearchComponent';
import FilterationBox from '../../components/FilterationBox';
import CouponStore from '../../stores/couponStore';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';
import classificationsService from '../../services/classifications/classificationsService';
import { CouponDto } from '../../services/coupons/dto/couponDto';
import CouponDetailsModal from './components/couponDetialsModal';
import CreateOrUpdateCoupon from './components/createOrUpdateCoupon';
import shopsService from '../../services/shops/shopsService';
import { ShopDto } from '../../services/shops/dto/shopDto';
import clientsService from '../../services/clients/clientsService';
import { CouponType } from '../../lib/types';

export interface ICouponsProps {
  couponStore?: CouponStore;
}
const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 6 },
  xl: { span: 6 },
  xxl: { span: 6 },
};
export interface ICouponsState {
  couponModalVisible: boolean;
  couponModalId: number;
  couponModalType: string;
  couponDetailsModalVisible: boolean;
  meta: {
    page: number;
    pageSize: number | undefined;
    skipCount: number;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
  };

  keyword?: string;
  classificationId?: number;
  clientId?: number;
  isFreeShipping?: boolean;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.CouponStore)
@observer
export class MyCoupons extends AppComponentBase<ICouponsProps, ICouponsState> {
  formRef = React.createRef<FormInstance>();
  classifications: LiteEntityDto[] = [];
  clients: LiteEntityDto[] = [];
  shopInfo: ShopDto | undefined = undefined;

  state = {
    couponModalVisible: false,
    couponModalId: 0,
    couponModalType: 'create',
    couponDetailsModalVisible: false,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      skipCount: 0,
      total: 0,
    },
    keyword: undefined,
    classificationId: undefined,
    clientId: undefined,
    isFreeShipping: undefined,
  };

  async componentDidMount() {
    let result = await classificationsService.getAllLite();
    this.classifications = result.items;

    const clientsResult = await clientsService.getAllLite({ isActive: true });
    this.clients = clientsResult.items;
    try {
      let result2 = await shopsService.getCurrentShopInfo();
      this.shopInfo = result2;
    } catch {
      window.location.href = '/user/shop/complete-registeration';
    }

    await this.updateCouponsList(this.state.meta.pageSize, 0);
  }

  async updateCouponsList(maxResultCount: number, skipCount: number) {
    this.props.couponStore!.maxResultCount = maxResultCount;
    this.props.couponStore!.skipCount = skipCount;
    this.props.couponStore!.classificationId = this.state.classificationId;
    this.props.couponStore!.keyword = this.state.keyword;
    this.props.couponStore!.myCoupons = true;
    this.props.couponStore!.clientId = this.state.clientId;
    this.props.couponStore!.isFreeShipping = this.state.isFreeShipping;

    this.props.couponStore!.getCoupons();
  }

  async openCouponModal(entityDto: EntityDto) {
    this.props.couponStore!.couponModel = undefined;
    if (entityDto.id === 0) {
      this.setState({ couponModalType: 'create' });
    } else {
      await this.props.couponStore!.getCoupon(entityDto);
      this.setState({ couponModalType: 'edit' });
    }

    this.setState({
      couponModalVisible: !this.state.couponModalVisible,
      couponModalId: entityDto.id,
    });
  }

  async openCouponDetailsModal(entityDto: EntityDto) {
    await this.props.couponStore!.getCoupon(entityDto);

    this.setState({
      couponDetailsModalVisible: !this.state.couponDetailsModalVisible,
      couponModalId: entityDto.id,
    });
  }

  couponsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Code'),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: L('DiscountPercentage'),
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
    },

    {
      title: L('Type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => {
        return (
          <Tag color={'blue'} className="ant-tag-disable-pointer">
            {type === CouponType.ForClient
              ? L('ForClient')
              : type === CouponType.ForShop
              ? L('ForShop')
              : type === CouponType.Other
              ? L('Other')
              : L('FreeShipping')}
          </Tag>
        );
      },
    },
    {
      title: L('Status'),
      dataIndex: 'isExpired',
      key: 'isExpired',
      render: (isExpired: boolean) => {
        return (
          <Tag color={isExpired ? 'magenta' : 'success'} className="ant-tag-disable-pointer">
            {isExpired ? L('Expired') : L('UnExpired')}
          </Tag>
        );
      },
    },
    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: CouponDto) => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon "
              onClick={() => this.openCouponDetailsModal({ id: item.id })}
            />
          </Tooltip>
          <Tooltip title={L('Edit')}>
            <EditOutlined
              className="action-icon "
              onClick={() => this.openCouponModal({ id: item.id })}
            />
          </Tooltip>
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
      this.updateCouponsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateCouponsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const coupons = this.props.couponStore!.coupons;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.couponStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('MyCoupons')}</span>
            <Button
              type="primary"
              style={{ float: localization.getFloat() }}
              icon={<PlusOutlined />}
              onClick={() => this.openCouponModal({ id: 0 })}
            >
              {L('AddCoupon')}
            </Button>
          </div>
        }
      >
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateCouponsList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />
        <FilterationBox>
          <Row style={{ display: 'flex', gap: '25px' }}>
            <Col {...colLayout}>
              <label>{L('ClassificationName')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                allowClear
                placeholder={L('PleaseSelectClassification')}
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={this.state.classificationId}
                onChange={(value: any) => {
                  this.setState({ classificationId: value });
                }}
              >
                {this.classifications.length > 0 &&
                  this.classifications.map((element: LiteEntityDto) => (
                    <Select.Option key={element.value} value={element.value}>
                      {element.text}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
            <Col {...colLayout}>
              <label>{L('ClientName')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                allowClear
                placeholder={L('PleaseSelectClient')}
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={this.state.clientId}
                onChange={(value: any) => {
                  this.setState({ clientId: value });
                }}
              >
                {this.clients.length > 0 &&
                  this.clients.map((element: LiteEntityDto) => (
                    <Select.Option key={element.value} value={element.value}>
                      {element.text}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
            <Col {...colLayout}>
              <label>{L('IsFreeShipping')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                optionFilterProp="children"
                onChange={(value: any) => {
                  this.setState({
                    isFreeShipping: value === 3 ? undefined : value === 1 ? true : false,
                  });
                }}
                value={
                  this.state.isFreeShipping === undefined ? 3 : !this.state.isFreeShipping ? 0 : 1
                }
              >
                <Select.Option key={0} value={0}>
                  {L('NotFreeShipping')}
                </Select.Option>
                <Select.Option key={1} value={1}>
                  {L('FreeShipping')}
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
                await this.updateCouponsList(this.state.meta.pageSize, this.state.meta.skipCount);
              }}
              style={{ width: 90 }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ classificationId: undefined }, async () => {
                  await this.updateCouponsList(this.state.meta.pageSize, this.state.meta.skipCount);
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
          loading={this.props.couponStore!.loadingCoupons}
          dataSource={coupons === undefined ? [] : coupons}
          columns={this.couponsTableColumns}
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
                  <b>{L('MaxTotalUseCount')}: </b>
                  {record.maxTotalUseCount}
                </span>
                <span>
                  <b>{L('MaxClientUseCount')}: </b>
                  {record.maxClientUseCount}
                </span>

                <span>
                  <b> {L('StartDate')}: </b>
                  {moment(record.startDate).format(timingHelper.defaultDateFormat)}
                </span>
                <span>
                  <b> {L('EndDate')}: </b>
                  {moment(record.endDate).format(timingHelper.defaultDateFormat)}
                </span>
              </p>
            ),
            rowExpandable: (record) => true,
          }}
        />

        <CreateOrUpdateCoupon
          formRef={this.formRef}
          visible={this.state.couponModalVisible}
          onCancel={() =>
            this.setState({
              couponModalVisible: false,
            })
          }
          couponModalId={this.state.couponModalId}
          modalType={this.state.couponModalType}
          isSubmittingCoupon={this.props.couponStore!.isSubmittingCoupon}
          couponStore={this.props.couponStore!}
          shopId={this.shopInfo?.id!}
        />

        <CouponDetailsModal
          visible={this.state.couponDetailsModalVisible}
          onCancel={() =>
            this.setState({
              couponDetailsModalVisible: false,
            })
          }
          couponStore={this.props.couponStore!}
        />
      </Card>
    );
  }
}

export default MyCoupons;
