/* eslint-disable */
import * as React from 'react';
import { Tag, Avatar, Tabs, Table } from 'antd';
import {
  InfoCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import ImageModel from '../../../components/ImageModal';
import { L } from '../../../i18next';
import AppComponentBase from '../../../components/AppComponentBase';
import './index.css';
import localization from '../../../lib/localization';
import { CategoryDto } from '../../../services/categories/dto/categoryDto';
import categoriesService from '../../../services/categories/categoriesService';
import { SimpleClassificationDto } from '../../../services/categories/dto/simpleClassificationDto';

const { TabPane } = Tabs;

export interface ICategoryDetailsModalState {
  categoryModel: CategoryDto;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  classificationsTotalCount: number;
  classificationsMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  classifications: Array<SimpleClassificationDto>;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

export class MyCategoryDetails extends AppComponentBase<any, ICategoryDetailsModalState> {
  state = {
    categoryModel: {} as CategoryDto,
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
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

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  async componentDidMount() {
    document.title = `${L('CategoryDetails')} | MOHRA `;

    try {
      if (this.props.match.params.id) {
        let id = this.props.match.params.id;
        let category = await categoriesService.getCategory({ id: id });
        this.setState({ categoryModel: category }, () => {
          this.setState({
            classifications: category.classifications,
            classificationsTotalCount: category.classifications.length,
          });
        });
      }
    } catch (e) {
      window.location.href = '/my-categories';
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

  render() {
    const { categoryModel, classifications } = this.state;

    const classificationsPagination = {
      ...this.classificationsPaginationOptions,
      total: this.state.classificationsTotalCount,
      current: this.state.classificationsMeta.page,
      pageSize: this.state.classificationsMeta.pageSize,
    };

    return (
      <div className="category-page">
        <span className="back-button">
          {localization.isRTL() ? (
            <ArrowRightOutlined onClick={() => (window.location.href = '/my-categories')} />
          ) : (
            <ArrowLeftOutlined onClick={() => (window.location.href = '/my-categories')} />
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
              {/* <div className="detail-wrapper">
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
              </div> */}
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

export default MyCategoryDetails;
