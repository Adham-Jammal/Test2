/* eslint-disable */
import * as React from 'react';
import { Avatar, Button, Card, Table, Tag, Select, Row, Col, Tooltip, Input, Space } from 'antd';
import { inject, observer } from 'mobx-react';
import {
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  OrderedListOutlined,
  CheckSquareOutlined,
  SearchOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import Highlighter from 'react-highlight-words';
import CategoryStore from '../../stores/categoryStore';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import CreateOrUpdateCategory from './components/createOrUpdateCategory';
import { CreateCategoryDto } from '../../services/categories/dto/createCategoryDto';
import { UpdateCategoryDto } from '../../services/categories/dto/updateCategoryDto';
import { CategoryDto } from '../../services/categories/dto/categoryDto';
import localization from '../../lib/localization';
import ImageModel from '../../components/ImageModal';
import ManageClassificationsModal from './components/ManageClassificationsModal';
import ClassificationStore from '../../stores/classificationStore';
import CategoryDetailsModal from './components/categoryDetailsModal';
import FilterationBox from '../../components/FilterationBox';
import { EventOrderDto } from '../../services/events/dto/updateEventOrdersDto';
import SortCategoryOrders from './components/sortCategoryOrders';

import ChangeStatusModal from '../../components/ChangeStatusModal';
import { isGranted } from '../../lib/abpUtility';
import { popupConfirm } from '../../lib/popupMessages';
import { getIsActiveWithShopStatusOptions } from '../../lib/types';

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
  changeStatusModalVisible: boolean;
  categoryModalVisible: boolean;
  categoriesModalId: number;
  categoryModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  categoryDetailsModalVisible: boolean;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  manageClassficationsModalVisible: boolean;
  permisssionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
    classificationsManagement: boolean;
  };
  statusFilter?: boolean;
  keyword?: string;
  openSortCategoriesModal: boolean;
  categoryModalId: number;
  categoryModalOldStatus: number;
  searchedColumns: string[];
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

declare let abp: any;
@inject(Stores.CategoryStore, Stores.ClassificationStore)
@observer
export class Categories extends AppComponentBase<ICategoriesProps, ICategoriesState> {
  formRef = React.createRef<FormInstance>();

  changeStatusFormRef = React.createRef<FormInstance>();

  searchInput: any = null;

  state = {
    categoryModalVisible: false,
    categoriesModalId: 0,
    categoryDetailsModalVisible: false,
    categoryModalType: 'create',
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
    manageClassficationsModalVisible: false,
    permisssionsGranted: {
      update: false,
      create: false,
      activation: false,
      classificationsManagement: false,
    },
    statusFilter: undefined,
    keyword: '',
    openSortCategoriesModal: false,
    changeStatusModalVisible: false,
    categoryModalId: 0,
    categoryModalOldStatus: 0,
    searchedColumns: [],
  };

  async componentDidMount() {
    this.setState({
      permisssionsGranted: {
        update: isGranted('Categories.Update'),
        create: isGranted('Categories.Create'),
        activation: isGranted('Categories.Activation'),
        classificationsManagement: isGranted('Classifications'),
      },
    });
    this.updateCategoriesList(this.state.meta.pageSize, 0);
  }

  async updateCategoriesList(maxResultCount: number, skipCount: number) {
    this.props.categoryStore!.maxResultCount = maxResultCount;
    this.props.categoryStore!.skipCount = skipCount;
    this.props.categoryStore!.statusFilter = this.state.statusFilter;
    this.props.categoryStore!.keyword = this.state.keyword;
    this.props.categoryStore!.getCategories();
  }

  async openCategoryDetailsModal(entityDto: EntityDto) {
    await this.props.categoryStore!.getCategory(entityDto);
    this.setState({
      categoryDetailsModalVisible: !this.state.categoryDetailsModalVisible,
      categoriesModalId: entityDto.id,
    });
  }

  openChangeStatusModal(id: number, oldStatus: number) {
    this.setState({
      categoryModalId: id,
      categoryModalOldStatus: oldStatus,
      changeStatusModalVisible: true,
    });
  }

  async openCategoryModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.categoryStore!.categoryModel = undefined;
      this.setState({ categoryModalType: 'create' });
    } else {
      await this.props.categoryStore!.getCategory(entityDto);
      this.setState({ categoryModalType: 'edit' });
    }
    this.setState({
      categoryModalVisible: !this.state.categoryModalVisible,
      categoriesModalId: entityDto.id,
    });
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

  updateCategoriesOrders = async (items: EventOrderDto[]) => {
    await this.props.categoryStore!.updateCategoryOrders(items);
    this.setState({ openSortCategoriesModal: false });
  };

  createOrUpdateCategory = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.imageUrl = document.getElementById('category-image')!.getAttribute('value')
        ? document.getElementById('category-image')!.getAttribute('value')
        : this.props.categoryStore!.categoryModel?.imageUrl;

      if (this.state.categoriesModalId === 0) {
        await this.props.categoryStore!.createCategory(values as CreateCategoryDto);
      } else {
        values.id = this.state.categoriesModalId;
        await this.props.categoryStore!.updateCategory(values as UpdateCategoryDto);
      }
      await this.props.categoryStore!.getCategories();
      this.setState({ categoryModalVisible: false });
      form!.resetFields();
    });
  };

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  async openManageClassificationsModal(id: number) {
    this.setState({ categoriesModalId: id });
    this.props.classificationStore!.maxResultCount = 4;
    this.props.classificationStore!.skipCount = 0;
    this.props.classificationStore!.classifications = [];
    await this.props.classificationStore!.getClassifications(id);
    this.setState({ manageClassficationsModalVisible: true });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  doneCategoryChangeStatus = () => {
    this.updateCategoriesList(this.state.meta.pageSize, 0);
  };

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

  changeStatus = async (item: CategoryDto) => {
    popupConfirm(
      async () => {
        if (!item.isActive) {
          await this.props.categoryStore!.categoryActivation({ id: item.id });
        } else {
          await this.props.categoryStore!.categoryDeactivation({ id: item.id });
        }
        await this.updateCategoriesList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      item.isActive
        ? L('AreYouSureYouWantToDeactivateThisCategory')
        : L('AreYouSureYouWantToActivateThisCategory')
    );
  };
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
        return !isActive ? (
          <Tag color="red" className="ant-tag-disable-pointer">
            {L('Inactive')}
          </Tag>
        ) : (
          <Tag color="green" className="ant-tag-disable-pointer">
            {L('Active')}
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
              onClick={() => (window.location.href = `/category/${item.id}`)}
            />
          </Tooltip>
          {this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon"
                onClick={() => this.openCategoryModal({ id: item.id })}
              />
            </Tooltip>
          ) : null}
          {item.isActive && this.state.permisssionsGranted.activation ? (
            <Tooltip title={L('Block')}>
              <StopOutlined
                className="action-icon  red-text"
                onClick={() => this.changeStatus(item)}
              />
            </Tooltip>
          ) : !item.isActive && this.state.permisssionsGranted.activation ? (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.changeStatus(item)}
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
      <Card
        title={
          <div>
            <span>{L('Categories')}</span>
            {this.state.permisssionsGranted.create ? (
              <Button
                type="primary"
                style={{
                  float: localization.getFloat(),
                  margin: localization.getFloat() === 'left' ? '0' : '0',
                }}
                icon={<PlusOutlined />}
                onClick={() => this.openCategoryModal({ id: 0 })}
              >
                {L('AddCategory')}
              </Button>
            ) : null}
            {this.props.categoryStore && this.props.categoryStore!.categories.length > 1 && (
              <Button
                type="default"
                style={{ float: localization.getFloat(), margin: '0 5px' }}
                icon={<OrderedListOutlined />}
                onClick={() => {
                  this.setState({
                    openSortCategoriesModal: true,
                  });
                }}
              >
                {L('SortCategories')}
              </Button>
            )}
          </div>
        }
      >
        {/* <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateCategoriesList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        /> */}

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

        {this.props.categoryStore && this.props.categoryStore!.categories.length > 1 && (
          <SortCategoryOrders
            visible={this.state.openSortCategoriesModal}
            onCancel={() =>
              this.setState({
                openSortCategoriesModal: false,
              })
            }
            categories={this.props.categoryStore!.categories.sort(this.compare)}
            onOk={this.updateCategoriesOrders}
            isSortingItems={this.props.categoryStore!.isSortingItems}
          />
        )}
        <Table
          pagination={pagination}
          rowKey={(record) => `${record.id}`}
          style={{ marginTop: '12px' }}
          loading={this.props.categoryStore!.loadingCategories}
          dataSource={categories === undefined ? [] : categories}
          columns={this.categoriesTableColumns}
          // onChange={this.handleChange}
        />

        <CreateOrUpdateCategory
          formRef={this.formRef}
          visible={this.state.categoryModalVisible}
          onCancel={() =>
            this.setState({
              categoryModalVisible: false,
            })
          }
          modalType={this.state.categoryModalType}
          onOk={this.createOrUpdateCategory}
          isSubmittingCategory={this.props.categoryStore!.isSubmittingCategory}
          categoryStore={this.props.categoryStore}
        />

        <ImageModel
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => {
            this.closeImageModal();
          }}
        />

        <ManageClassificationsModal
          onCancel={() => {
            this.setState({ manageClassficationsModalVisible: false });
          }}
          visible={this.state.manageClassficationsModalVisible}
          categoryId={this.state.categoriesModalId}
        />
        <CategoryDetailsModal
          visible={this.state.categoryDetailsModalVisible}
          onCancel={() =>
            this.setState({
              categoryDetailsModalVisible: false,
            })
          }
          categoryStore={this.props.categoryStore!}
        />

        <ChangeStatusModal
          formRef={this.changeStatusFormRef}
          isOpen={this.state.changeStatusModalVisible}
          id={this.state.categoryModalId}
          oldStatus={this.state.categoryModalOldStatus}
          service="Category"
          onDone={this.doneCategoryChangeStatus}
          options={getIsActiveWithShopStatusOptions()}
          onClose={() =>
            this.setState({
              changeStatusModalVisible: false,
            })
          }
        />
      </Card>
    );
  }
}

export default Categories;
