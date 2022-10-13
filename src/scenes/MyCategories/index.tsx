/* eslint-disable */
import * as React from 'react';
import { Avatar, Button, Card, Table, Tag, Select, Row, Col, Tooltip, Input, Space } from 'antd';
import { inject, observer } from 'mobx-react';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import CategoryStore from '../../stores/categoryStore';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { CategoryDto } from '../../services/categories/dto/categoryDto';
import ImageModel from '../../components/ImageModal';
import ClassificationStore from '../../stores/classificationStore';
import FilterationBox from '../../components/FilterationBox';
import SearchComponent from '../../components/SearchComponent';
import shopsService from '../../services/shops/shopsService';
import { ShopDto } from '../../services/shops/dto/shopDto';

export interface ICategoriesProps {
  categoryStore?: CategoryStore;
  classificationStore: ClassificationStore;
}

const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 6 },
  xl: { span: 6 },
  xxl: { span: 6 },
};
export interface ICategoriesState {
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  statusFilter?: boolean;
  keyword?: string;
  searchedColumns: string[];
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.CategoryStore, Stores.ClassificationStore)
@observer
export class MyCategories extends AppComponentBase<ICategoriesProps, ICategoriesState> {
  searchInput: any = null;

  state = {
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
    statusFilter: undefined,
    keyword: '',
    searchedColumns: [],
  };
  shopInfo: ShopDto | undefined = undefined;

  async componentDidMount() {
    try {
      let result2 = await shopsService.getCurrentShopInfo();
      this.shopInfo = result2;
    } catch {
      window.location.href = '/user/shop/complete-registeration';
    }
    this.updateCategoriesList(this.state.meta.pageSize, 0);
  }

  async updateCategoriesList(maxResultCount: number, skipCount: number) {
    this.props.categoryStore!.maxResultCount = maxResultCount;
    this.props.categoryStore!.skipCount = skipCount;
    this.props.categoryStore!.statusFilter = this.state.statusFilter;
    this.props.categoryStore!.keyword = this.state.keyword;
    this.props.categoryStore!.getCategories();
  }

  compare = (a: any, b: any) => {
    if (a.order < b.order) {
      return -1;
    }
    if (a.order > b.order) {
      return 1;
    }
    return 0;
  };

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
  };

  handleReset = (clearFilters: any) => {
    clearFilters();
    this.setState({ keyword: '' });
  };

  getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            this.setState({
              keyword: `${dataIndex} ${e.target.value};`,
              searchedColumns: [...this.state.searchedColumns, dataIndex],
            });
          }}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button> */}
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text: any) =>
      this.state.keyword.split(';').some((e) => e.split(' ')[0] === dataIndex) ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[
            this.state.keyword
              .split(';')
              .filter((e) => e.split(' ')[0] === dataIndex)[0]
              .split(' ')[1],
          ]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  categoriesTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
      ...this.getColumnSearchProps('name'),
    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string, item: CategoryDto) => {
        return (
          <div
            onClick={() => this.openImageModal(item.imageUrl!, item.enName)}
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
          <Tag color={isActive ? 'green' : 'red'} className="ant-tag-disable-pointer">
            {isActive ? L('Active') : L('Inactive')}
          </Tag>
        );
      },
    },
    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: CategoryDto) => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon"
              onClick={() => (window.location.href = `/my-category/${item.id}`)}
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
      this.updateCategoriesList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateCategoriesList(
        this.state.meta.pageSize,
        (page - 1) * this.state.meta.pageSize
      );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const { categories } = this.props.categoryStore!;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.categoryStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card title={L('MyCategories')}>
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateCategoriesList(this.state.meta.pageSize, this.state.meta.skipCount);
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
                    statusFilter: value === 3 ? undefined : value === 1 ? true : false,
                  });
                }}
                value={this.state.statusFilter === undefined ? 3 : !this.state.statusFilter ? 0 : 1}
              >
                <Select.Option key={0} value={0}>
                  {L('Inactive')}
                </Select.Option>
                <Select.Option key={1} value={1}>
                  {L('Active')}
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
                await this.updateCategoriesList(
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
                this.setState({ statusFilter: undefined }, async () => {
                  await this.updateCategoriesList(
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
          rowKey={(record) => `${record.id}`}
          style={{ marginTop: '12px' }}
          loading={this.props.categoryStore!.loadingCategories}
          dataSource={categories === undefined ? [] : categories}
          columns={this.categoriesTableColumns}
          // onChange={this.handleChange}
        />

        <ImageModel
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => {
            this.closeImageModal();
          }}
        />
      </Card>
    );
  }
}

export default MyCategories;
