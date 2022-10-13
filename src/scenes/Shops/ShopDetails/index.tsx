/* eslint-disable */
import * as React from 'react';
import { Tag, Tabs, Image, Table } from 'antd';
import {
  InfoCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import ImageModel from '../../../components/ImageModal';
import { L } from '../../../i18next';
import AppComponentBase from '../../../components/AppComponentBase';
import './index.css';
import localization from '../../../lib/localization';
import { ShopDto } from '../../../services/shops/dto/shopDto';
import shopsService from '../../../services/shops/shopsService';
import timingHelper from '../../../lib/timingHelper';
import { LiteEntityDto } from '../../../services/locations/dto/liteEntityDto';
import { PaymentDto } from '../../../services/payments/dto/paymentDto';
import ThousandSeparator from '../../../components/ThousandSeparator';
import { PaymentMethod } from '../../../lib/types';

const { TabPane } = Tabs;

export interface IShopDetailsModalState {
  shopModel: ShopDto;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  categories: Array<LiteEntityDto>;
  payments: Array<PaymentDto>;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

export class ShopDetails extends AppComponentBase<any, IShopDetailsModalState> {
  state = {
    shopModel: {} as ShopDto,
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    categories: [],
    payments: [],
    paymentsMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    paymentsTotalCount: 0,
  };

  paymentsColumns = [
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
  ];

  paymentsPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.paymentsMeta.pageSize = pageSize;
      this.setState(temp);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.paymentsMeta.page = page;
      this.setState(temp);
    },
    pageSizeOptions: this.state.paymentsMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  async componentDidMount() {
    document.title = `${L('ShopDetails')} | MOHRA `;

    try {
      if (this.props.match.params.id) {
        const { id } = this.props.match.params;
        const shop = await shopsService.getShop({ id });
        this.setState({ shopModel: shop }, () => {
          this.setState({
            categories: shop.categories,
            payments: shop.payments,
          });
        });
      }
    } catch (e) {
      window.location.href = '/shops';
    }
  }

  render() {
    const { shopModel, categories, payments } = this.state;
    const paymentsPagination = {
      ...this.paymentsPaginationOptions,
      total: this.state.paymentsTotalCount,
      current: this.state.paymentsMeta.page,
      pageSize: this.state.paymentsMeta.pageSize,
    };
    return (
      <div className="shop-page">
        <span className="back-button">
          {localization.isRTL() ? (
            <ArrowRightOutlined onClick={() => (window.location.href = '/shops')} />
          ) : (
            <ArrowLeftOutlined onClick={() => (window.location.href = '/shops')} />
          )}
        </span>

        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <InfoCircleOutlined />
                {L('General')}
              </span>
            }
            key="1"
          >
            <div className="details-wrapper">
              <div className="detail-wrapper">
                <span className="detail-label">{L('ArName')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined ? shopModel.arName : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('EnName')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined ? shopModel.enName : undefined}
                </span>
              </div>
              {shopModel !== undefined && shopModel.arLogoUrl && (
                <div className="detail-wrapper image">
                  <span className="detail-label">{L('ArLogoImage')}:</span>

                  <span className="detail-value">
                    {shopModel !== undefined ? (
                      <Image className="shop-logo" src={shopModel.arLogoUrl} />
                    ) : undefined}
                  </span>
                </div>
              )}
              {shopModel !== undefined && shopModel.enLogoUrl && (
                <div className="detail-wrapper image">
                  <span className="detail-label">{L('EnLogoImage')}:</span>

                  <span className="detail-value">
                    {shopModel !== undefined ? (
                      <Image className="shop-logo" src={shopModel.enLogoUrl} />
                    ) : undefined}
                  </span>
                </div>
              )}
              {shopModel !== undefined && shopModel.arCoverUrl && (
                <div className="detail-wrapper image">
                  <span className="detail-label">{L('ArCoverImage')}:</span>

                  <span className="detail-value">
                    {shopModel !== undefined ? (
                      <Image className="shop-cover" src={shopModel.arCoverUrl} />
                    ) : undefined}
                  </span>
                </div>
              )}
              {shopModel !== undefined && shopModel.enCoverUrl && (
                <div className="detail-wrapper image">
                  <span className="detail-label">{L('EnCoverImage')}:</span>

                  <span className="detail-value">
                    {shopModel !== undefined ? (
                      <Image className="shop-cover" src={shopModel.enCoverUrl} />
                    ) : undefined}
                  </span>
                </div>
              )}
              {/* <div className="detail-wrapper">
                <span className="detail-label">{L('Email')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined ? shopModel.shopEmail : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('PhoneNumber')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined
                    ? shopModel?.shopCountryCode! + ' ' + shopModel.shopPhoneNumber
                    : undefined}
                </span>
              </div> */}

              <div className="detail-wrapper">
                <span className="detail-label">{L('City')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined ? shopModel.city?.text : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Code')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined ? shopModel.code : undefined}
                </span>
              </div>
              {/* <div className="detail-wrapper">
                <span className="detail-label">{L('Bank')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined ? shopModel.bank?.text : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('BankAccountNumber')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined ? shopModel.accountNumber : undefined}
                </span>
              </div> */}
              <div className="detail-wrapper">
                <span className="detail-label">{L('ArDescription')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined && shopModel.arDescription
                    ? shopModel.arDescription
                    : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('EnDescription')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined && shopModel.enDescription
                    ? shopModel.enDescription
                    : L('NotAvailable')}
                </span>
              </div>
              {/* <div className="detail-wrapper">
                <span className="detail-label">{L('ArSalesAndReturn')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined && shopModel.arSaleAndReturnPolicy
                    ? shopModel.arSaleAndReturnPolicy
                    : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('EnSalesAndReturn')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined && shopModel.enSaleAndReturnPolicy
                    ? shopModel.enSaleAndReturnPolicy
                    : L('NotAvailable')}
                </span>
              </div> */}
              {/* <div className="detail-wrapper">
                <span className="detail-label">{L('CommercialRecordNumber')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined ? shopModel.commercialNumber : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('CommercialRecordReleaseDate')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined
                    ? moment(shopModel.recordReleaseDate).format(timingHelper.defaultDateFormat)
                    : undefined}
                </span>
              </div> */}
              <div className="detail-wrapper">
                <span className="detail-label">{L('Categories')}:</span>
                <span className="detail-value">
                  {categories !== undefined
                    ? categories.map((item: LiteEntityDto) => {
                        return (
                          <Tag key={item.value} color="default" className="classification-name">
                            {item.text}
                          </Tag>
                        );
                      })
                    : undefined}
                </span>
              </div>
              {/* <div className="detail-wrapper">
                <span className="detail-label">{L('FacebookUrl')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined && shopModel.facebookUrl
                    ? shopModel.facebookUrl
                    : L('NotAvailable')}
                </span>
              </div> */}
              {/* <div className="detail-wrapper">
                <span className="detail-label">{L('InstagramUrl')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined && shopModel.instagramUrl
                    ? shopModel.instagramUrl
                    : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('TwitterUrl')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined && shopModel.twitterUrl
                    ? shopModel.twitterUrl
                    : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('SnapUrl')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined && shopModel.snapUrl
                    ? shopModel.snapUrl
                    : L('NotAvailable')}
                </span>
              </div> */}

              <div className="detail-wrapper">
                <span className="detail-label">{L('IsActive')}:</span>
                <span className="detail-value">
                  <Tag
                    color={shopModel !== undefined && shopModel.isActive ? 'green' : 'volcano'}
                    className="ant-tag-disable-pointer"
                  >
                    {shopModel !== undefined && shopModel.isActive ? L('Active') : L('Inactive')}
                  </Tag>
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('ProductsCount')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined ? shopModel.productsCount : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('OrdersCount')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined ? shopModel.ordersCount : undefined}
                </span>
              </div>
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <TagsOutlined />
                {L('Payments')}
              </span>
            }
            key="2"
          >
            <Table
              dataSource={payments !== undefined ? payments : []}
              columns={this.paymentsColumns}
              pagination={paymentsPagination}
              rowKey={(record) => `${record.id}`}
            />
          </TabPane>
        </Tabs>

        <ImageModel
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => {
            this.closeImageModal();
          }}
        />
      </div>
    );
  }
}

export default ShopDetails;
