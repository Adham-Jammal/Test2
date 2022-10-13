/* eslint-disable */
import * as React from 'react';
import { Tag, Avatar, Tabs, Table } from 'antd';
import {
  InfoCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  ShopOutlined,
  TagsOutlined,
  GoldOutlined,
} from '@ant-design/icons';
import ImageModel from '../../../components/ImageModal';
import { L } from '../../../i18next';
import AppComponentBase from '../../../components/AppComponentBase';
import './index.css';
import localization from '../../../lib/localization';
import { CategoryDto } from '../../../services/categories/dto/categoryDto';
import categoriesService from '../../../services/categories/categoriesService';
import { SimpleClassificationDto } from '../../../services/categories/dto/simpleClassificationDto';
import { SimpleProductDto } from '../../../services/categories/dto/simpleProductDto';
import ThousandSeparator from '../../../components/ThousandSeparator';
import { SimpleShopDto } from '../../../services/categories/dto/simpleShopDto';

const { TabPane } = Tabs;

export interface ICategoryDetailsModalState {
  categoryModel: CategoryDto;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  shopsMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  productsTotalCount: number;
  productsMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  classificationsTotalCount: number;
  classificationsMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  shopsTotalCount: number;
  shops: Array<SimpleShopDto>;
  products: Array<SimpleProductDto>;
  classifications: Array<SimpleClassificationDto>;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

export class CategoryDetails extends AppComponentBase<any, ICategoryDetailsModalState> {
  state = {
    categoryModel: {} as CategoryDto,
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    shops: [],
    products: [],
    classifications: [],
    classificationsMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    classificationsTotalCount: 0,
    productsMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    productsTotalCount: 0,
    shopsMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    shopsTotalCount: 0,
  };

  classificationsColumns = [
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string, item: SimpleClassificationDto) => {
        return (
          <div
            onClick={() => this.openImageModal(item.imageUrl!, item.name)}
            style={{ display: 'inline-block', cursor: 'zoom-in' }}
          >
            <Avatar shape="square" size={50} src={item.imageUrl} />
          </div>
        );
      },
    },
  ];

  productsColumns = [
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: ` ${L('Price')} (${L('SAR')})`,
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => {
        return <ThousandSeparator number={price} />;
      },
    },
    {
      title: L('Description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string, item: SimpleProductDto) => {
        return (
          <div
            onClick={() => this.openImageModal(item.imageUrl!, item.name)}
            style={{ display: 'inline-block', cursor: 'zoom-in' }}
          >
            <Avatar shape="square" size={50} src={item.imageUrl} />
          </div>
        );
      },
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
    },
  ];

  ShopsColumns = [
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: L('Description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: L('Logo'),
      dataIndex: 'logoUrl',
      key: 'logoUrl',
      render: (logoUrl: string, item: SimpleShopDto) => {
        return (
          <div
            onClick={() => this.openImageModal(item.logoUrl!, item.name)}
            style={{ display: 'inline-block', cursor: 'zoom-in' }}
          >
            <Avatar shape="square" size={50} src={item.logoUrl} />
          </div>
        );
      },
    },
    {
      title: L('Cover'),
      dataIndex: 'coverUrl',
      key: 'coverUrl',
      render: (coverUrl: string, item: SimpleShopDto) => {
        return (
          <div
            onClick={() => this.openImageModal(item.coverUrl!, item.name)}
            style={{ display: 'inline-block', cursor: 'zoom-in' }}
          >
            <Avatar shape="square" size={50} src={item.coverUrl} />
          </div>
        );
      },
    },
  ];

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  async componentDidMount() {
    document.title = `${L('CategoryDetails')} | Bialah `;

    try {
      if (this.props.match.params.id) {
        let id = this.props.match.params.id;
        let category = await categoriesService.getCategory({ id: id });
        this.setState({ categoryModel: category }, () => {
          this.setState({
            shops: category.shops,
            classifications: category.classifications,
            products: category.products,
            productsTotalCount: category.products.length,
            shopsTotalCount: category.shops.length,
            classificationsTotalCount: category.classifications.length,
          });
        });
      }
    } catch (e) {
      window.location.href = '/categories';
    }
  }

  classificationsPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.classificationsMeta.pageSize = pageSize;
      this.setState(temp);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.classificationsMeta.page = page;
      this.setState(temp);
    },
    pageSizeOptions: this.state.classificationsMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  shopsPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.shopsMeta.pageSize = pageSize;
      this.setState(temp);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.shopsMeta.page = page;
      this.setState(temp);
    },
    pageSizeOptions: this.state.shopsMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  productsPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.productsMeta.pageSize = pageSize;
      this.setState(temp);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.productsMeta.page = page;
      this.setState(temp);
    },
    pageSizeOptions: this.state.productsMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };
  render() {
    const { categoryModel, classifications, products, shops } = this.state;

    const classificationsPagination = {
      ...this.classificationsPaginationOptions,
      total: this.state.classificationsTotalCount,
      current: this.state.classificationsMeta.page,
      pageSize: this.state.classificationsMeta.pageSize,
    };
    const shopsPagination = {
      ...this.shopsPaginationOptions,
      total: this.state.shopsTotalCount,
      current: this.state.shopsMeta.page,
      pageSize: this.state.shopsMeta.pageSize,
    };
    const productssPagination = {
      ...this.productsPaginationOptions,
      total: this.state.productsTotalCount,
      current: this.state.productsMeta.page,
      pageSize: this.state.productsMeta.pageSize,
    };
    return (
      <div className="category-page">
        <span className="back-button">
          {localization.isRTL() ? (
            <ArrowRightOutlined onClick={() => (window.location.href = '/categories')} />
          ) : (
            <ArrowLeftOutlined onClick={() => (window.location.href = '/categories')} />
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
                  {categoryModel !== undefined ? categoryModel.arName : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('EnName')}:</span>
                <span className="detail-value">
                  {categoryModel !== undefined ? categoryModel.enName : undefined}
                </span>
              </div>

              <div className="detail-wrapper">
                <span className="detail-label">{L('Status')}:</span>
                <span className="detail-value">
                  {categoryModel !== undefined && categoryModel.isActive ? (
                    <Tag color="green">{L('Active')}</Tag>
                  ) : (
                    <Tag color="red">{L('Inactive')}</Tag>
                  )}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Image')}:</span>
                <span className="detail-value image">
                  {categoryModel !== undefined ? (
                    <div
                      onClick={() =>
                        this.openImageModal(categoryModel.imageUrl!, categoryModel.enName)
                      }
                      style={{ display: 'inline-block', cursor: 'zoom-in' }}
                    >
                      <Avatar shape="square" size={50} src={categoryModel.imageUrl} />
                    </div>
                  ) : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('ProductsCount')}:</span>
                <span className="detail-value">
                  {categoryModel !== undefined ? categoryModel.productsCount : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('OrdersCount')}:</span>
                <span className="detail-value">
                  {categoryModel !== undefined ? categoryModel.ordersCount : undefined}
                </span>
              </div>
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <TagsOutlined />
                {L('Classifications')}
              </span>
            }
            key="2"
          >
            <Table
              dataSource={classifications !== undefined ? classifications : []}
              columns={this.classificationsColumns}
              pagination={classificationsPagination}
              rowKey={(record) => record.id + ''}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <ShopOutlined />
                {L('Shops')}
              </span>
            }
            key="3"
          >
            <Table
              dataSource={shops !== undefined ? shops : []}
              columns={this.ShopsColumns}
              pagination={shopsPagination}
              rowKey={(record) => record.id + ''}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <GoldOutlined />
                {L('Products')}
              </span>
            }
            key="4"
          >
            <Table
              dataSource={products !== undefined ? products : []}
              columns={this.productsColumns}
              pagination={productssPagination}
              rowKey={(record) => record.id + ''}
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

export default CategoryDetails;
