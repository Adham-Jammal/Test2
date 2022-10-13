/* eslint-disable */

import * as React from 'react';
import { Avatar, Button, Card, Table, Tag, Select, Row, Col, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import {
  CheckSquareOutlined,
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  StopOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import { popupConfirm } from '../../lib/popupMessages';
import localization from '../../lib/localization';
import ImageModel from '../../components/ImageModal';
import SearchComponent from '../../components/SearchComponent';
import userService from '../../services/user/userService';
import utils from '../../utils/utils';
import FilterationBox from '../../components/FilterationBox';
import NewsStore from '../../stores/newsStore';
import { CreateNewsDto } from '../../services/news/dto/createNewsDto';
import { UpdateNewsDto } from '../../services/news/dto/updateNewsDto';
import { NewsDto } from '../../services/news/dto/NewsDto';
import NewsDetailsModal from './components/newsDetailsModal';
import CreateOrUpdateNews from './components/createOrUpdateNews';
import locationsService from '../../services/locations/locationsService';
import { LiteEntityDto } from '../../services/locations/dto/liteEntityDto';
import newsCategoriesService from '../../services/newsCategory/newsCategoriesService';
import { NewsCategoryDto } from '../../services/newsCategory/dto/newsCategoryDto';
import SearchColumnBox from '../../components/SearchColumnBox';
import timingHelper from '../../lib/timingHelper';
import moment from 'moment';
import { LocationType } from '../../lib/types';

const filterationColLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 7 },
  xl: { span: 7 },
  xxl: { span: 7 },
};

export interface INewsProps {
  newsStore: NewsStore;
}

export interface INewsState {
  newsModalVisible: boolean;
  newsModalId: number;
  newsModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  newsDetailsModalVisible: boolean;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  permisssionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
  };
  isActiveFilter?: boolean;
  keyword?: string;
  advancedSearchKeyword: string;
  searchedColumns: string[];
}

declare let abp: any;

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.NewsStore)
@observer
export class News extends AppComponentBase<INewsProps, INewsState> {
  formRef = React.createRef<FormInstance>();

  currentUser: any = undefined;

  cities: LiteEntityDto[] = [];

  newsCategories: NewsCategoryDto[] = [];

  state = {
    newsModalVisible: false,
    newsModalId: 0,
    newsModalType: 'create',
    newsDetailsModalVisible: false,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    permisssionsGranted: {
      update: false,
      create: false,
      activation: false,
    },
    isActiveFilter: undefined,
    keyword: undefined,
    advancedSearchKeyword: '',
    searchedColumns: [],
  };

  searchInput: any;

  async componentDidMount(): Promise<void> {
    this.currentUser = await userService.get({ id: abp.session.userId });
    const result = await locationsService.getAllLite({ type: LocationType.City });
    this.cities = result.items;

    const categoriesResult = await newsCategoriesService.getAll({ isActive: true });
    this.newsCategories = categoriesResult.items;

    this.setState({
      permisssionsGranted: {
        update: (await utils.checkIfGrantedPermission('News.Update')).valueOf(),
        create: (await utils.checkIfGrantedPermission('News.Create')).valueOf(),
        activation: (await utils.checkIfGrantedPermission('News.Activation')).valueOf(),
      },
    });
    this.updateNewsList(this.state.meta.pageSize, 0);
  }

  async updateNewsList(maxResultCount: number, skipCount: number, sorting?: string): Promise<void> {
    this.props.newsStore!.maxResultCount = maxResultCount;
    this.props.newsStore!.skipCount = skipCount;
    this.props.newsStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.newsStore!.keyword = this.state.keyword;
    this.props.newsStore!.advancedSearchKeyword = this.state.advancedSearchKeyword;
    this.props.newsStore!.sorting = sorting;
    this.props.newsStore!.getAllNews();
  }

  async openNewsModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.newsStore!.newsModel = undefined;
      this.setState({ newsModalType: 'create' });
    } else {
      await this.props.newsStore!.getNews(entityDto);
      this.setState({ newsModalType: 'edit' });
    }
    this.setState({ newsModalVisible: !this.state.newsModalVisible, newsModalId: entityDto.id });
  }

  async openNewsDetailsModal(entityDto: EntityDto) {
    await this.props.newsStore!.getNews(entityDto);
    this.setState({
      newsDetailsModalVisible: !this.state.newsDetailsModalVisible,
      newsModalId: entityDto.id,
    });
  }

  createOrUpdateNews = ({ arEditor, enEditor }: any) => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.arDescription = arEditor.getData();
      values.enDescription = enEditor.getData();
      values.fromDate = values.fromDate?._d || this.props.newsStore!.newsModel?.fromDate;
      values.toDate = values.toDate?._d || this.props.newsStore!.newsModel?.toDate;

      if (this.state.newsModalId === 0) {
        await this.props.newsStore!.createNews(values as CreateNewsDto);
      } else {
        values.id = this.state.newsModalId;
        await this.props.newsStore!.updateNews(values as UpdateNewsDto);
      }
      await this.updateNewsList(this.state.meta.pageSize, this.state.meta.skipCount);
      this.setState({ newsModalVisible: false });
      form!.resetFields();
    });
  };

  onSwitchNewsActivation = async (news: NewsDto) => {
    popupConfirm(
      async () => {
        if (news.isActive) await this.props.newsStore!.newsDeactivation({ id: news.id });
        else await this.props.newsStore!.newsActivation({ id: news.id });
        await this.updateNewsList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      news.isActive
        ? L('AreYouSureYouWantToDeactivateThisNews')
        : L('AreYouSureYouWantToActivateThisNews')
    );
  };

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  handleTableChange = (pagination: any, filters: any, sorter: any): void => {
    if (sorter.order === 'ascend') {
      this.updateNewsList(this.state.meta.pageSize, 0, `${sorter.columnKey} ASC`);
    } else if (sorter.order === 'descend') {
      this.updateNewsList(this.state.meta.pageSize, 0, `${sorter.columnKey} DESC`);
    } else {
      this.updateNewsList(this.state.meta.pageSize, 0);
    }
  };

  newsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Title'),
      dataIndex: 'title',
      key: 'title',
      ...SearchColumnBox.getColumnSearchProps(
        'title',
        (search: string) => this.setState({ advancedSearchKeyword: search }),
        () => this.updateNewsList(this.state.meta.pageSize, 0),
        () => this.forceUpdate()
      ),
    },

    {
      title: L('ViewsCount'),
      dataIndex: 'viewsCount',
      key: 'ViewsCount',
      sorter: true,
    },
    {
      title: L('SavedCount'),
      dataIndex: 'savedCount',
      key: 'SavedCount',
      sorter: true,
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
    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: NewsDto) => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon "
              onClick={() => this.openNewsDetailsModal({ id: item.id })}
            />
          </Tooltip>
          {this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon "
                onClick={() => this.openNewsModal({ id: item.id })}
              />
            </Tooltip>
          ) : null}
          {item.isActive ? (
            this.state.permisssionsGranted.activation ? (
              <Tooltip title={L('Deactivate')}>
                <StopOutlined
                  className="action-icon  red-text"
                  onClick={() => this.onSwitchNewsActivation(item)}
                />
              </Tooltip>
            ) : null
          ) : this.state.permisssionsGranted.activation ? (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.onSwitchNewsActivation(item)}
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
      this.updateNewsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateNewsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const { news } = this.props.newsStore!;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.newsStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('News')}</span>
            {this.state.permisssionsGranted.create ? (
              <Button
                type="primary"
                style={{ float: localization.getFloat() }}
                icon={<PlusOutlined />}
                onClick={() => this.openNewsModal({ id: 0 })}
              >
                {L('AddNews')}
              </Button>
            ) : null}
          </div>
        }
      >
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateNewsList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />
        <FilterationBox>
          <Row>
            <Col {...filterationColLayout}>
              <label>{L('IsActive')}</label>

              <Select
                style={{ display: 'block' }}
                showSearch
                optionFilterProp="children"
                onChange={(value: any) => {
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
                await this.updateNewsList(this.state.meta.pageSize, this.state.meta.skipCount);
              }}
              style={{ width: 90 }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ isActiveFilter: undefined }, async () => {
                  await this.updateNewsList(this.state.meta.pageSize, this.state.meta.skipCount);
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
          rowKey={(record) => `${record.id}`}
          style={{ marginTop: '12px' }}
          loading={this.props.newsStore!.loadingNews}
          dataSource={news === undefined ? [] : news}
          columns={this.newsTableColumns}
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
                  {record.category?.name}
                </span>
                <span>
                  <b>{L('SourceName')}: </b>
                  {record.sourceName}
                </span>
                <span>
                  <b>{L('SourceLogo')}: </b>
                  <div
                    onClick={() => this.openImageModal(record.sourceLogo!, record.enTitle)}
                    style={{ display: 'inline-block', cursor: 'zoom-in' }}
                  >
                    <Avatar shape="square" size={50} src={record.sourceLogo} />
                  </div>
                </span>
                <span>
                  <b>{L('Image')}: </b>
                  <span
                    onClick={() => this.openImageModal(record.imageUrl!, record.enTitle)}
                    style={{ display: 'inline-block', cursor: 'zoom-in' }}
                  >
                    <Avatar shape="square" size={50} src={record.imageUrl} />
                  </span>
                </span>

                <span>
                  <b>{L('Tags')}: </b>
                  {record.tags?.map((tag: string) => (
                    <Tag
                      style={{ display: 'inline-block', width: 'fit-content' }}
                      color="purple"
                      className="ant-tag-disable-pointer"
                    >
                      {tag}
                    </Tag>
                  ))}
                </span>

                <span>
                  <b>{L('FromDate')}:</b>{' '}
                  {moment(record.fromDate).format(timingHelper.defaultDateFormat)}
                </span>
                <span>
                  <b>{L('ToDate')}:</b>{' '}
                  {moment(record.toDate).format(timingHelper.defaultDateFormat)}
                </span>
                <span>
                  <b>{L('CreationDate')}:</b>{' '}
                  {moment(record.creationTime).format(timingHelper.defaultDateFormat)}
                </span>
                <span>
                  <b>{L('CreatedBy')}:</b> {record.createdBy}
                </span>
              </p>
            ),
            rowExpandable: (record) => true,
          }}
        />

        <CreateOrUpdateNews
          formRef={this.formRef}
          visible={this.state.newsModalVisible}
          onCancel={() =>
            this.setState({
              newsModalVisible: false,
            })
          }
          modalType={this.state.newsModalType}
          onOk={this.createOrUpdateNews}
          isSubmittingNews={this.props.newsStore!.isSubmittingNews}
          newsStore={this.props.newsStore}
          cities={this.cities}
          newsCategories={this.newsCategories}
        />

        <ImageModel
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => {
            this.closeImageModal();
          }}
        />

        <NewsDetailsModal
          visible={this.state.newsDetailsModalVisible}
          onCancel={() =>
            this.setState({
              newsDetailsModalVisible: false,
            })
          }
          newsStore={this.props.newsStore!}
        />
      </Card>
    );
  }
}

export default News;
