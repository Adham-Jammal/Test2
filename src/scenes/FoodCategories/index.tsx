/* eslint-disable */
import * as React from 'react';
import { Avatar, Button, Card, Table, Tag, Select, Row, Col, Tooltip, Input, Space } from 'antd';
import { inject, observer } from 'mobx-react';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import CreateOrUpdateCategory from './components/createOrUpdateCategory';
// import { CategoryDto } from '../../services/categories/dto/categoryDto';
//import { popupConfirm } from '../../lib/popupMessages';
import localization from '../../lib/localization';
import ImageModel from '../../components/ImageModal';
import {
  EditOutlined,
  PlusOutlined,
  CheckSquareOutlined,
  SearchOutlined,
  StopOutlined,
  UpOutlined,
  DownOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import userService from '../../services/user/userService';
import utils from '../../utils/utils';
//import SearchComponent from '../../components/SearchComponent';
import FilterationBox from '../../components/FilterationBox';
import { EventOrderDto } from '../../services/events/dto/updateEventOrdersDto';
// import IsActiveWithShopStatus from '../../services/types/isActiveWithShopStatus'; // getIsActiveWithShopStatusOptions,
// import ChangeStatusModal from '../../components/ChangeStatusModal';
import Highlighter from 'react-highlight-words';
import Stores from '../../stores/storeIdentifier';
import FoodCategoryStore from '../../stores/foodCategoryStore';
import { FoodCategoryDto } from '../../services/foodCategory/dto/foodCategoryDto';
import { CreateFoodCategoryDto } from '../../services/foodCategory/dto/createFoodCategoryDto';
import { UpdateFoodCategoryDto } from '../../services/foodCategory/dto/updateFoodCategoryDto';
import { popupConfirm } from '../../lib/popupMessages';
import SearchColumnBox from '../../components/SearchColumnBox';
import moment from 'moment';
import timingHelper from '../../lib/timingHelper';
import CategoryDetailsModal from './components/categoryDetailsModal';

export interface ICategoriesProps {
  foodCategoryStore: FoodCategoryStore;
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
  };
  statusFilter?: boolean;
  keyword?: string;
  advancedSearchKeyword: string;
  openSortCategoriesModal: boolean;
  categoryModalId: number;
  categoryModalOldStatus: boolean;
  searchedColumns: string[];
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

declare var abp: any;
@inject(Stores.FoodCategoryStore)
@observer
export class Categories extends AppComponentBase<ICategoriesProps, ICategoriesState> {
  formRef = React.createRef<FormInstance>();
  changeStatusFormRef = React.createRef<FormInstance>();

  currentUser: any = undefined;

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
    advancedSearchKeyword: '',
    openSortCategoriesModal: false,
    changeStatusModalVisible: false,
    categoryModalId: 0,
    categoryModalOldStatus: false,
    searchedColumns: [],
  };

  async componentDidMount() {
    this.currentUser = await userService.get({ id: abp.session.userId });
    this.setState({
      permisssionsGranted: {
        update: (await utils.checkIfGrantedPermission('Categories.Update')).valueOf(),
        create: (await utils.checkIfGrantedPermission('Categories.Create')).valueOf(),
        activation: (await utils.checkIfGrantedPermission('Categories.Activation')).valueOf(),
      },
    });
    this.updateFoodCategoriesList(this.state.meta.pageSize, 0);
  }

  // update FoodCategories list based on different properties
  async updateFoodCategoriesList(maxResultCount: number, skipCount: number, sorting?: string) {
    this.props.foodCategoryStore!.maxResultCount = maxResultCount;
    this.props.foodCategoryStore!.skipCount = skipCount;
    this.props.foodCategoryStore!.statusFilter = this.state.statusFilter;
    this.props.foodCategoryStore!.keyword = this.state.keyword;
    this.props.foodCategoryStore!.advancedSearchKeyword = this.state.advancedSearchKeyword;
    this.props.foodCategoryStore!.sorting = sorting;
    await this.props.foodCategoryStore!.getFoodCategories();
  }

  openChangeStatusModal(id: number, oldStatus: boolean) {
    this.setState({
      categoryModalId: id,
      categoryModalOldStatus: oldStatus,
      changeStatusModalVisible: true,
    });
  }

  async openCategoryModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.foodCategoryStore!.categoryModel = undefined;
      this.setState({ categoryModalType: 'create' });
    } else {
      await this.props.foodCategoryStore!.getFoodCategory(entityDto);
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
    this.setState({ openSortCategoriesModal: false });
  };

  createOrUpdateCategory = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.imageUrl = document.getElementById('category-image')!.getAttribute('value')
        ? document.getElementById('category-image')!.getAttribute('value')
        : this.props.foodCategoryStore!.categoryModel?.imageUrl;

      if (this.state.categoriesModalId === 0) {
        this.props.foodCategoryStore!.createFoodCategory(values as CreateFoodCategoryDto);
      } else {
        values.id = this.state.categoriesModalId;
        this.props.foodCategoryStore!.updateFoodCategory(values as UpdateFoodCategoryDto);
      }
      this.setState({ categoryModalVisible: false });
      form!.resetFields();
    });
  };

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  doneCategoryChangeStatus = () => {};

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
              keyword: dataIndex + ' ' + e.target.value + ';',
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

  handleTableChange = (pagination: any, filters: any, sorter: any): void => {
    if (sorter.order === 'ascend') {
      this.updateFoodCategoriesList(this.state.meta.pageSize, 0, `${sorter.columnKey} ASC`);
    } else if (sorter.order === 'descend') {
      this.updateFoodCategoriesList(this.state.meta.pageSize, 0, `${sorter.columnKey} DESC`);
    } else {
      this.updateFoodCategoriesList(this.state.meta.pageSize, 0);
    }
  };

  async openFoodCategoryDetailsModal(entity: EntityDto) {
    this.props.foodCategoryStore!.getFoodCategory(entity);
    this.setState({
      categoryDetailsModalVisible: !this.state.categoryDetailsModalVisible,
    });
  }

  onSwitchNewsActivation = async (category: FoodCategoryDto) => {
    popupConfirm(
      async () => {
        if (category.isActive)
          await this.props.foodCategoryStore!.foodCategoryDeactivation({ id: category.id });
        else await this.props.foodCategoryStore!.foodCategoryActivation({ id: category.id });
      },
      category.isActive
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
      title: L('Title'),
      dataIndex: 'title',
      key: 'title',
      ...SearchColumnBox.getColumnSearchProps(
        'title',
        (search: string) => this.setState({ advancedSearchKeyword: search }),
        () => this.updateFoodCategoriesList(this.state.meta.pageSize, 0),
        () => this.forceUpdate()
      ),
    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string, item: FoodCategoryDto) => {
        return (
          <div
            onClick={() => this.openImageModal(item.imageUrl!, item.enTitle)}
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

    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: FoodCategoryDto) => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon"
              onClick={() => this.openFoodCategoryDetailsModal({ id: item.id })}
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
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const foodCategories = this.props.foodCategoryStore!.foodCategories;

    const pagination = {
      ...this.paginationOptions,
      total: this.props.foodCategoryStore!.totalCount,
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
                className="filter-select"
                showSearch
                optionFilterProp="children"
                onChange={(value: boolean) => {
                  this.setState({
                    statusFilter: value,
                  });
                }}
                defaultValue={this.state.statusFilter}
                value={this.state.statusFilter}
              >
                <Select.Option key={0} value={false}>
                  {L('Inactive')}
                </Select.Option>
                <Select.Option key={1} value={true}>
                  {L('Active')}
                </Select.Option>
                <Select.Option value={undefined}>{L('All')}</Select.Option>
              </Select>
            </Col>
          </Row>

          <Row style={{ marginTop: '15px' }}>
            <Button
              type="primary"
              onClick={async () => {
                await this.updateFoodCategoriesList(
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
                  await this.updateFoodCategoriesList(
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
          loading={this.props.foodCategoryStore!.loadingCategories}
          dataSource={foodCategories || []}
          columns={this.categoriesTableColumns}
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
                  <b>{L('CreatedBy')}: </b>
                  {record.createdBy}
                </span>

                <span>
                  <b>{L('CreationDate')}:</b>{' '}
                  {moment(record.creationTime).format(timingHelper.defaultDateFormat)}
                </span>
              </p>
            ),
            rowExpandable: (record) => true,
          }}
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
          isSubmittingCategory={false}
          foodCategoryStore={this.props.foodCategoryStore}
        />

        <ImageModel
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => {
            this.closeImageModal();
          }}
        />

        <CategoryDetailsModal
          visible={this.state.categoryDetailsModalVisible}
          onCancel={() =>
            this.setState({
              categoryDetailsModalVisible: false,
            })
          }
          foodCategoryStore={this.props.foodCategoryStore!}
        />
      </Card>
    );
  }
}

export default Categories;
