/* eslint-disable */
import * as React from 'react';
import { Row, Col, Card, Tooltip, Table, Tag, Button, Select, FormInstance, Image } from 'antd';
import './index.less';
import {
  CheckSquareOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FilterOutlined,
  StarFilled,
  StarOutlined,
  StopOutlined,
  UpOutlined,
} from '@ant-design/icons';
import CreateOrUpdateProducts from '../MyProducts/components/CreateOrUpdateProducts';
import { L } from '../../i18next';
import { ShopStatisticsDto } from '../../services/dashboard/dto/dashboardDto';
import ThousandSeparator from '../../components/ThousandSeparator';
import localization from '../../lib/localization';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import { EntityDto } from '../../services/dto/entityDto';
import { ShopDto } from '../../services/shops/dto/shopDto';
import { popupConfirm } from '../../lib/popupMessages';
import SearchComponent from '../../components/SearchComponent';
import timingHelper from '../../lib/timingHelper';
import moment from 'moment';
import OrderStore from '../../stores/orderStore';
import { CouponType, OrderType, PaymentMethod } from '../../lib/types';
import { OrderDto } from '../../services/orders/dto/orderDto';
import OrderDetailsModal from '../Orders/components/orderDetailsModal';
import shopsService from '../../services/shops/shopsService';
import CouponStore from '../../stores/couponStore';
import { CouponDto } from '../../services/coupons/dto/couponDto';
import CouponDetailsModal from '../MyCoupons/components/couponDetialsModal';
import CreateOrUpdateCoupon from '../MyCoupons/components/createOrUpdateCoupon';
import ProductStore from '../../stores/productStore';
import { CreateProductDto, ProductDto, UpdateProductDto } from '../../services/products/dto';
import ProductDetails from '../MyProducts/components/ProductDetails';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';
import sizeService from '../../services/size/sizeService';
import colorService from '../../services/color/colorService';
import classificationsService from '../../services/classifications/classificationsService';
import dashboardService from '../../services/dashboard/dashboardService';
import ExcellentExport from 'excellentexport';

export interface IDashboardState {
  dashboardData: ShopStatisticsDto;
  cardLoading: boolean;
  loadingReports: boolean;
  couponModalVisible: boolean;
  couponModalId: number;
  couponModalType: string;
  productDetailsModalVisible: boolean;
  productKeyword?: string;
  productMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    skipCount: number;
    pageTotal: number;
    total: number;
  };
  productModalVisible: boolean;
  productModalId: number;
  productModalType: string;
  couponKeyword?: string;
  couponMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    skipCount: number;
    pageTotal: number;
    total: number;
  };
  couponDetailsModalVisible: boolean;
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
  productStore?: ProductStore;
  orderStore?: OrderStore;
  couponStore?: CouponStore;
}

export interface ListItem {
  title: string;
  body: string | React.ReactNode;
}
const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.ProductStore, Stores.CouponStore, Stores.OrderStore)
@observer
export class ShopDashboard extends React.Component<IDashboardProps, IDashboardState> {
  formRef = React.createRef<FormInstance>();

  state = {
    dashboardData: {} as ShopStatisticsDto,
    cardLoading: true,
    loadingReports: false,
    productModalVisible: false,
    productModalId: 0,
    productModalType: 'create',
    productMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    productDetailsModalVisible: false,
    productKeyword: undefined,
    couponDetailsModalVisible: false,
    couponKeyword: undefined,
    couponMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      skipCount: 0,
      pageTotal: 1,
      total: 0,
    },
    couponModalVisible: false,
    couponModalId: 0,
    couponModalType: 'create',
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

  shopInfo: ShopDto | undefined = undefined;
  classifications: LiteEntityDto[] = [];

  colors: LiteEntityDto[] = [];

  sizes: LiteEntityDto[] = [];
  async componentDidMount() {
    try {
      let result2 = await shopsService.getCurrentShopInfo();
      const [sizes, colors, shopInfo] = await Promise.all([
        sizeService.getAllLite(),
        colorService.getAllLite(),
        shopsService.getCurrentShopInfo(),
      ]);

      this.colors = colors?.items;
      this.sizes = sizes?.items;
      this.shopInfo = shopInfo;
      this.shopInfo = result2;
    } catch {
      window.location.href = '/user/shop/complete-registeration';
    }
    const dashboardData = await dashboardService.getShopStatistics();
    this.setState({ dashboardData: dashboardData });
    setTimeout(() => this.setState({ cardLoading: false }), 0);
    this.updateProductsList(this.state.productMeta.pageSize, 0);
    await this.updateCouponsList(this.state.couponMeta.pageSize, 0);
    await this.updateOrdersList(this.state.orderMeta.pageSize, 0);
  }
  async componentDidUpdate() {
    if (this.shopInfo !== undefined && this.classifications.length === 0) {
      const [classifications] = await Promise.all([
        classificationsService.getAllLite({
          CategoryIds:
            this.shopInfo.categories && this.shopInfo.categories.length > 0
              ? this.shopInfo.categories.map((cat) => cat.value)
              : [],
        }),
      ]);

      this.classifications = classifications?.items;
    }
  }
  async updateOrdersList(maxResultCount: number, skipCount: number) {
    this.props.orderStore!.maxResultCount = maxResultCount;
    this.props.orderStore!.skipCount = skipCount;
    this.props.orderStore!.keyword = this.state.orderKeyword;
    this.props.orderStore!.statusFilter = this.state.orderStatusFilter;
    this.props.orderStore!.myOrders = true;
    this.props.orderStore!.getOrders();
  }

  async updateCouponsList(maxResultCount: number, skipCount: number) {
    this.props.couponStore!.maxResultCount = maxResultCount;
    this.props.couponStore!.skipCount = skipCount;
    this.props.couponStore!.keyword = this.state.couponKeyword;
    this.props.couponStore!.myCoupons = true;

    this.props.couponStore!.getCoupons();
  }

  async openCouponDetailsModal(entityDto: EntityDto) {
    await this.props.couponStore!.getCoupon(entityDto);

    this.setState({
      couponDetailsModalVisible: !this.state.couponDetailsModalVisible,
    });
  }

  // open Product Details Modal
  async openProductDetailsModal(entityDto: EntityDto): Promise<void> {
    await this.props.productStore!.getProduct(entityDto);
    this.setState({ productDetailsModalVisible: true });
  }

  // open Product create or update Modal
  async openProductModal(input: EntityDto): Promise<void> {
    if (input.id === 0) {
      this.props.productStore!.productModel = undefined;
      this.setState({ productModalType: 'create', productModalId: input.id });
    } else {
      await this.props.productStore!.getProduct({ id: input.id });
      this.setState({ productModalType: 'update', productModalId: input.id });
    }
    this.setState({ productModalVisible: !this.state.productModalVisible });
  }

  // update products list
  async updateProductsList(
    maxResultCount: number,
    skipCount: number,
    sorting?: string
  ): Promise<void> {
    this.props.productStore!.maxResultCount = maxResultCount;
    this.props.productStore!.skipCount = skipCount;
    this.props.productStore!.keyword = this.state.productKeyword;
    this.props.productStore!.myProducts = true;
    this.props.productStore!.sorting = sorting;
    await this.props.productStore!.getProducts();
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
      title: L('CreationDate'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (creationTime: string) => {
        return moment(creationTime).format(timingHelper.defaultDateFormat);
      },
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

  async openOrderDetailsModal(entityDto: EntityDto) {
    await this.props.orderStore!.getOrder(entityDto);
    this.setState({ orderDetailsModalVisible: !this.state.orderDetailsModalVisible });
  }
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

  // handle product activation
  onSwitchProductActivation = async (product: ProductDto): Promise<void> => {
    popupConfirm(
      async () => {
        if (product.isActive) {
          await this.props.productStore!.productDeactivation({ id: product.id });
        } else await this.props.productStore!.productActivation({ id: product.id });
        await this.updateProductsList(this.state.productMeta.pageSize, 0);
      },
      product.isActive
        ? L('AreYouSureYouWantToDeactivateThisProduct')
        : L('AreYouSureYouWantToActivateThisProduct')
    );
  };

  // handle product featured
  onSwitchProductFeature = async (product: ProductDto): Promise<void> => {
    popupConfirm(
      async () => {
        if (product.isFeatured) await this.props.productStore!.productUnFeature({ id: product.id });
        else await this.props.productStore!.productFeature({ id: product.id });
        await this.updateProductsList(this.state.productMeta.pageSize, 0);
      },
      product.isFeatured
        ? L('AreYouSureYouWantToUnFeatureThisProduct')
        : L('AreYouSureYouWantToFeatureThisProduct')
    );
  };

  // handle change of sorter
  handleTableChange = (_1: any, _2: any, sorter: any): void => {
    if (sorter.order === 'ascend') {
      this.updateProductsList(this.state.productMeta.pageSize, 0, `${sorter.columnKey} ASC`);
    } else if (sorter.order === 'descend') {
      this.updateProductsList(this.state.productMeta.pageSize, 0, `${sorter.columnKey} DESC`);
    } else {
      this.updateProductsList(this.state.productMeta.pageSize, 0);
    }
  };

  // product table columns
  productsTableColumns = [
    {
      title: L('Number'),
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string): JSX.Element => (
        <Image
          width={50}
          height={50}
          style={{ objectFit: 'cover' }}
          src={imageUrl}
          alt={L('Image')}
        />
      ),
    },
    {
      title: `${L('Price')} (${L('SAR')})`,
      dataIndex: 'price',
      key: 'Price',
      sorter: true,
      render: (price?: number): JSX.Element | '' => {
        return price != null ? <ThousandSeparator number={price} /> : '';
      },
    },

    {
      title: L('soldCount'),
      dataIndex: 'soldCount',
      key: 'TopSelling',
      sorter: true,
    },
    {
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean): JSX.Element => (
        <Tag color={isActive ? 'green' : 'volcano'} className="ant-tag-disable-pointer">
          {isActive ? L('Active') : L('Inactive')}
        </Tag>
      ),
    },

    {
      title: L('Action'),
      key: 'action',
      render: (_: any, item: ProductDto): JSX.Element => (
        <div>
          <Tooltip title={L('Edit')}>
            <EditOutlined
              className="action-icon"
              onClick={() => this.openProductModal({ id: item?.id })}
            />
          </Tooltip>

          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon "
              onClick={() => this.openProductDetailsModal({ id: item.id })}
            />
          </Tooltip>
          {item.isActive && (
            <Tooltip title={L('Deactivate')}>
              <StopOutlined
                className="action-icon  red-text"
                onClick={() => this.onSwitchProductActivation(item)}
              />
            </Tooltip>
          )}
          {!item.isActive && (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.onSwitchProductActivation(item)}
              />
            </Tooltip>
          )}
          {item.isFeatured && (
            <Tooltip title={L('SetNotFeature')}>
              <StarOutlined
                className="action-icon  red-text"
                onClick={() => this.onSwitchProductFeature(item)}
              />
            </Tooltip>
          )}
          {!item.isFeatured && (
            <Tooltip title={L('SetFeature')}>
              <StarFilled
                className="action-icon  green-text"
                onClick={() => this.onSwitchProductFeature(item)}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  // handle submit create or update product
  onOk = async (values: CreateProductDto | UpdateProductDto): Promise<void> => {
    const { productModalType } = this.state;
    if (productModalType === 'update') {
      await this.props.productStore!.updateProduct(values as UpdateProductDto);
    } else {
      await this.props.productStore!.createProduct(values);
    }
    this.props.productStore!.productModel = undefined;
  };

  // product table pagination options
  productPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.productMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateProductsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.productMeta.page = page;
      this.setState(temp);
      await this.updateProductsList(
        this.state.productMeta.pageSize,
        (page - 1) * this.state.productMeta.pageSize
      );
    },
    pageSizeOptions: this.state.productMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

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

  couponPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.couponMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateCouponsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.couponMeta.page = page;
      this.setState(temp);
      await this.updateCouponsList(
        this.state.couponMeta.pageSize,
        (page - 1) * this.state.couponMeta.pageSize
      );
    },
    pageSizeOptions: this.state.couponMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  render() {
    const { cardLoading, dashboardData } = this.state;
    const products = this.props.productStore!.products;
    const productPagination = {
      ...this.productPaginationOptions,
      total: this.props.productStore!.totalCount,
      current: this.state.productMeta.page,
      pageSize: this.state.productMeta.pageSize,
    };
    const orders = this.props.orderStore!.orders;
    const orderPagination = {
      ...this.orderPaginationOptions,
      total: this.props.orderStore!.totalCount,
      current: this.state.orderMeta.page,
      pageSize: this.state.orderMeta.pageSize,
    };
    const coupons = this.props.couponStore!.coupons;
    const couponsPagination = {
      ...this.couponPaginationOptions,
      total: this.props.couponStore!.totalCount,
      current: this.state.couponMeta.page,
      pageSize: this.state.couponMeta.pageSize,
    };
    return (
      <>
        <Row className={localization.isRTL() ? 'rtl topBoxes' : 'topBoxes'}>
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={4}>
            <Card className="dasboardCard-item " loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.activeProducts} />
              </label>
              <span className="dashboardCardName">{L('ActiveProducts')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={4}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.activeCoupons} />
              </label>
              <span className="dashboardCardName">{L('ActiveCoupons')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={4}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.activePromotions} />
              </label>
              <span className="dashboardCardName">{L('ActivePromotions')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>{' '}
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={4}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.profit} />
              </label>
              <span className="dashboardCardName">{L('ProfitAmount')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={4}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.approvededOrders} />
              </label>
              <span className="dashboardCardName">{L('ApprovedOrders')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>{' '}
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={4}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.waitingOrders} />
              </label>
              <span className="dashboardCardName">{L('WaitingOrders')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>{' '}
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={4}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.returnedOrders} />
              </label>
              <span className="dashboardCardName">{L('ReturnedOrders')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>{' '}
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={4}>
            {/* New Dashboard Card */}
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={this?.shopInfo?.followersCount} />
              </label>
              <span className="dashboardCardName">{L('FollowersCount')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>{' '}
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={4}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.deliveredOrders} />
              </label>
              <span className="dashboardCardName">{L('DeliveredOrders')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>{' '}
          <Col className="dashboardCard customCard" xs={12} sm={9} md={9} lg={4}>
            <Card className="dasboardCard-item" loading={cardLoading}>
              <label className="dashboardCardCounter">
                <ThousandSeparator number={dashboardData!.inprogressOrders} />
              </label>
              <span className="dashboardCardName">{L('InProgressOrders')}</span>
              <div className="vertical-line" />
            </Card>
          </Col>{' '}
        </Row>
        <Row gutter={50}>
          <Col span={24}>
            <Card
              className="dashboardBox"
              title={
                <div>
                  <span>{L('Products')}</span>
                  <a
                    download="products.xlsx"
                    className="excelBtn"
                    style={{ float: localization.getFloat() }}
                    id="productsExport"
                    href="#"
                    onClick={() => {
                      return ExcellentExport.convert(
                        {
                          anchor: document.getElementById('productsExport') as HTMLAnchorElement,
                          filename: L('Products'),
                          format: 'xlsx',
                        },
                        [
                          {
                            name: L('Products'),
                            from: {
                              table: document.getElementById(
                                'productsDatatable'
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
                <table id="productsDatatable" style={{ display: 'none' }}>
                  <thead>
                    <tr>
                      <td>{L('Number')}</td>
                      <td>{L('Name')}</td>
                      <td>{L('Description')}</td>
                      <td>{L('Price')}</td>
                      <td>{L('SoldCount')}</td>
                      <td>{L('Status')}</td>
                      <td>{L('AvailableStock')}</td>
                      <td>{L('CreationDate')}</td>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product: ProductDto, index: number) => {
                      return (
                        <tr key={index}>
                          <td>{product.number}</td>
                          <td>{product.name}</td>
                          <td>{product.description}</td>
                          <td>{product.price}</td>
                          <td>{product.soldCount}</td>
                          <td>{product.isActive ? L('Active') : L('Inactive')}</td>
                          <td>{product.availableStock}</td>

                          <td>
                            {moment(product.creationTime).format(timingHelper.defaultDateFormat)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <SearchComponent
                  onSearch={(value: string) => {
                    this.setState({ productKeyword: value }, () => {
                      this.updateProductsList(
                        this.state.productMeta.pageSize,
                        this.state.productMeta.skipCount
                      );
                    });
                  }}
                />
                <Col xs={24}>
                  <Table
                    onChange={this.handleTableChange}
                    pagination={productPagination}
                    rowKey={(record) => `${record.id}`}
                    style={{ marginTop: '12px' }}
                    loading={this.props.productStore!.loadingProducts}
                    dataSource={products === undefined ? [] : products}
                    columns={this.productsTableColumns}
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
                            <b>{L('SubCategoryName')}: </b>
                            {record.classificationName}
                          </span>
                          <span>
                            <b>{L('rate')}: </b>
                            {record.rate}
                          </span>

                          <span>
                            <b>{L('IsFeatured')}: </b>
                            <Tag
                              color={record.isFeatured ? 'green' : 'volcano'}
                              className="ant-tag-disable-pointer"
                            >
                              {record.isFeatured ? L('Featured') : L('Unfeatured')}
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

                  <CreateOrUpdateProducts
                    colors={this.colors}
                    sizes={this.sizes}
                    visible={this.state.productModalVisible}
                    onCancel={() =>
                      this.setState({
                        productModalVisible: false,
                      })
                    }
                    isGettingData={this.props.productStore?.isGettingData!}
                    onOk={this.onOk}
                    modalType={this.state.productModalType}
                    isSubmittingProduct={this.props.productStore?.isSubmittingProduct!}
                    classifications={this.classifications}
                    productData={this.props.productStore?.productModel}
                    shopId={this.shopInfo?.id!}
                  />

                  <ProductDetails
                    visible={this.state.productDetailsModalVisible}
                    onCancel={() => {
                      this.setState({
                        productDetailsModalVisible: false,
                      });
                      this.props!.productStore!.productModel = undefined;
                    }}
                    productData={this.props.productStore?.productModel}
                    isGettingData={this.props.productStore?.isGettingData}
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
                  <span>{L('Coupons')}</span>
                  <a
                    download="coupons.xlsx"
                    className="excelBtn"
                    style={{ float: localization.getFloat() }}
                    id="couponsExport"
                    href="#"
                    onClick={() => {
                      return ExcellentExport.convert(
                        {
                          anchor: document.getElementById('couponsExport') as HTMLAnchorElement,
                          filename: L('Coupons'),
                          format: 'xlsx',
                        },
                        [
                          {
                            name: L('Coupons'),
                            from: {
                              table: document.getElementById(
                                'couponsDatatable'
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
                <SearchComponent
                  onSearch={(value: string) => {
                    this.setState({ couponKeyword: value }, () => {
                      this.updateCouponsList(
                        this.state.couponMeta.pageSize,
                        this.state.couponMeta.skipCount
                      );
                    });
                  }}
                />
                <Col xs={24}>
                  <Table
                    pagination={couponsPagination}
                    rowKey={(record) => record.id + ''}
                    style={{ marginTop: '12px' }}
                    loading={this.props.couponStore!.loadingCoupons}
                    dataSource={coupons === undefined ? [] : coupons}
                    columns={this.couponsTableColumns}
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
                  <table id="couponsDatatable" style={{ display: 'none' }}>
                    <thead>
                      <tr>
                        <td>{L('ID')}</td>
                        <td>{L('Code')}</td>
                        <td>{L('DiscountPercentage')}</td>
                        <td>{L('Type')}</td>
                        <td>{L('StartDate')}</td>
                        <td>{L('EndDate')}</td>
                        <td>{L('CreationDate')}</td>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((coupon: CouponDto, index: number) => {
                        return (
                          <tr key={index}>
                            <td>{coupon.id}</td>
                            <td>{coupon.code}</td>
                            <td>{coupon.discountPercentage}</td>
                            <td>
                              {coupon.type === CouponType.ForClient
                                ? L('ForClient')
                                : coupon.type === CouponType.ForShop
                                ? L('ForShop')
                                : coupon.type === CouponType.IsFreeShipping
                                ? L('IsFreeShipping')
                                : L('Other')}
                            </td>
                            <td>
                              {moment(coupon.startDate).format(timingHelper.defaultDateFormat)}
                            </td>
                            <td>{moment(coupon.endDate).format(timingHelper.defaultDateFormat)}</td>
                            <td>
                              {moment(coupon.creationTime).format(timingHelper.defaultDateFormat)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Card
              className="dashboardBox"
              title={
                <div>
                  <span>{L('Orders')}</span>
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

export default ShopDashboard;
