/* eslint-disable */
import * as React from 'react';
import { Card, Table, Tag, Select, Button, Col, Row, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import moment from 'moment';
import timingHelper from '../../lib/timingHelper';
import SearchComponent from '../../components/SearchComponent';
import ThousandSeparator from '../../components/ThousandSeparator';
import FilterationBox from '../../components/FilterationBox';
import PaymentStore from '../../stores/paymentStore';
import { PaymentDto } from '../../services/payments/dto/paymentDto';
import { EyeOutlined } from '@ant-design/icons';
import { LiteEntityDto } from '../../services/locations/dto/liteEntityDto';
import shopsService from '../../services/shops/shopsService';
import { PaymentMethod } from '../../lib/types';

const filterationColLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 7 },
  xl: { span: 7 },
  xxl: { span: 7 },
};

const filterationColLayout2 = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 9, offset: 2 },
  lg: { span: 7, offset: 1 },
  xl: { span: 7, offset: 1 },
  xxl: { span: 7, offset: 1 },
};

export interface IPaymentsProps {
  paymentStore: PaymentStore;
}

export interface IPaymentsState {
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  keyword?: string;
  method?: number;
  shopId?: number;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];
declare var abp: any;

@inject(Stores.PaymentStore)
@observer
export class Payments extends AppComponentBase<IPaymentsProps, IPaymentsState> {
  shops: LiteEntityDto[] = [];

  currentUser: any = undefined;
  state = {
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    keyword: undefined,
    method: undefined,
    shopId: undefined,
  };

  async componentDidMount() {
    let result = await shopsService.getAllLite();
    this.shops = result.items;

    await this.updatePaymentsList(this.state.meta.pageSize, 0);
  }

  async updatePaymentsList(maxResultCount: number, skipCount: number) {
    this.props.paymentStore!.maxResultCount = maxResultCount;
    this.props.paymentStore!.skipCount = skipCount;
    this.props.paymentStore!.method = this.state.method;
    this.props.paymentStore!.shopId = this.state.shopId;
    this.props.paymentStore!.keyword = this.state.keyword;

    await this.props.paymentStore!.getPayments();
  }

  renderPaymentMethod = (method: number) => {
    switch (method) {
      case PaymentMethod.ApplePay:
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {L('ApplePay')}
          </Tag>
        );
      case PaymentMethod.Cash:
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {L('Cash')}
          </Tag>
        );
      case PaymentMethod.CreditCard:
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {L('CreditCard')}
          </Tag>
        );
      case PaymentMethod.Mada:
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {L('Mada')}
          </Tag>
        );
      case PaymentMethod.STCPay:
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {L('STCPay')}
          </Tag>
        );
    }
    return null;
  };

  paymentsTableColumns = [
    {
      title: L('TransactionId'),
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: L('PaymentId'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('ShopId'),
      dataIndex: 'shopId',
      key: 'shopId',
    },
    {
      title: L('OrderNumber'),
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: L('Sender'),
      dataIndex: 'sender',
      key: 'sender',
      render: (sender: any, item: PaymentDto) => {
        return item.sender?.text;
      },
    },
    {
      title: L('Receipt'),
      dataIndex: 'receipt',
      key: 'receipt',
      render: (receipt: any, item: PaymentDto) => {
        return item.receipt?.text;
      },
    },
    {
      title: `${L('Amount')} (${L('SAR')})`,
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: any) => {
        return <ThousandSeparator number={amount} />;
      },
    },
    {
      title: `${L('Fee')} (${L('SAR')})`,
      dataIndex: 'fee',
      key: 'fee',
      render: (fee: any) => {
        return <ThousandSeparator number={fee} />;
      },
    },
    {
      title: L('PaymentMethod'),
      dataIndex: 'method',
      key: 'method',
      render: (paymentMethod: number) => {
        let paymentMethodName = undefined;
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
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {paymentMethodName}
          </Tag>
        );
      },
    },

    {
      title: L('CreationTime'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (creationTime: string) => {
        return creationTime
          ? moment(creationTime).format(timingHelper.defaultDateTimeFormat)
          : undefined;
      },
    },
    {
      title: L('Action'),
      key: 'action',
      width: '10%',
      render: (text: string, item: PaymentDto) => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon "
              onClick={() => (window.location.href = `/payment/${item.transactionId}`)}
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
      this.updatePaymentsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updatePaymentsList(
        this.state.meta.pageSize,
        (page - 1) * this.state.meta.pageSize
      );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const payments = this.props.paymentStore!.payments;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.paymentStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Payments')}</span>
          </div>
        }
      >
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updatePaymentsList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />

        <FilterationBox>
          <Row>
            <Col {...filterationColLayout}>
              <label>{L('PaymentMethod')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                placeholder={L('PleaseSelectPaymentMethod')}
                optionFilterProp="children"
                allowClear
                filterOption={(input, option: any) =>
                  option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={this.state.method}
                onChange={(value: any) => {
                  this.setState({ method: value });
                }}
              >
                <Select.Option value={PaymentMethod.ApplePay} key={PaymentMethod.ApplePay}>
                  {L('ApplePay')}
                </Select.Option>
                <Select.Option value={PaymentMethod.Cash} key={PaymentMethod.Cash}>
                  {L('Cash')}
                </Select.Option>
                <Select.Option value={PaymentMethod.CreditCard} key={PaymentMethod.CreditCard}>
                  {L('CreditCard')}
                </Select.Option>
                <Select.Option value={PaymentMethod.Mada} key={PaymentMethod.Mada}>
                  {L('Mada')}
                </Select.Option>
                <Select.Option value={PaymentMethod.STCPay} key={PaymentMethod.STCPay}>
                  {L('STCPay')}
                </Select.Option>
              </Select>
            </Col>
            <Col {...filterationColLayout2}>
              <label>{L('ShopName')}</label>

              <Select
                style={{ display: 'block' }}
                showSearch
                allowClear
                placeholder={L('PleaseSelectShop')}
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={this.state.shopId}
                onChange={(value: any) => {
                  this.setState({ shopId: value });
                }}
              >
                {this.shops.length > 0 &&
                  this.shops.map((element: LiteEntityDto) => (
                    <Select.Option key={element.value} value={element.value}>
                      {element.text}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px' }}>
            <Button
              type="primary"
              onClick={async () => {
                await this.updatePaymentsList(this.state.meta.pageSize, this.state.meta.skipCount);
              }}
              style={{ width: 90 }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ method: undefined, shopId: undefined }, async () => {
                  await this.updatePaymentsList(
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
          loading={this.props.paymentStore!.loadingPayments}
          dataSource={payments === undefined ? [] : payments}
          columns={this.paymentsTableColumns}
        />
      </Card>
    );
  }
}

export default Payments;
