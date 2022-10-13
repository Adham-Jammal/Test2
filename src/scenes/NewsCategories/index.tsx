/* eslint-disable */
import * as React from 'react';
import { Button, Card, Table, Tag, Tooltip, Input, Space, Avatar } from 'antd';
import { inject, observer } from 'mobx-react';
import Highlighter from 'react-highlight-words';
import { FormInstance } from 'antd/lib/form';
import {
  EditOutlined,
  PlusOutlined,
  CheckSquareOutlined,
  SearchOutlined,
  StopOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import CreateOrUpdateCategory from './components/createOrUpdateCategory';
import localization from '../../lib/localization';
import userService from '../../services/user/userService';
import utils from '../../utils/utils';
import NewsCategoryStore from '../../stores/newsCategoryStore';
import { NewsCategoryDto } from '../../services/newsCategory/dto/newsCategoryDto';
import { CreateNewsCategoryDto } from '../../services/newsCategory/dto/createNewsCategoryDto';
import { UpdateNewsCategoryDto } from '../../services/newsCategory/dto/updateNewsCategoryDto';
import { popupConfirm } from '../../lib/popupMessages';
import { IsActive } from './IsActive';
import ImageModel from '../../components/ImageModal';
import moment from 'moment';
import timingHelper from '../../lib/timingHelper';

export interface ICategoriesProps {
  newsCategoryStore?: NewsCategoryStore;
}

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
  permisssionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
    classificationsManagement: boolean;
  };
  statusFilter?: number;
  keyword?: string;
  openSortCategoriesModal: boolean;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  categoryModalId: number;
  categoryModalOldStatus: number;
  searchedColumns: string[];
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

declare let abp: any;
@inject(Stores.CategoryStore, Stores.ClassificationStore, Stores.NewsCategoryStore)
@observer
export class NewsCategories extends AppComponentBase<ICategoriesProps, ICategoriesState> {
  formRef = React.createRef<FormInstance>();

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
    permisssionsGranted: {
      update: false,
      create: false,
      activation: false,
      classificationsManagement: false,
    },
    statusFilter: undefined,
    keyword: '',
    openSortCategoriesModal: false,
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    changeStatusModalVisible: false,
    categoryModalId: 0,
    categoryModalOldStatus: 0,
    searchedColumns: [],
  };

  async componentDidMount(): Promise<void> {
    this.currentUser = await userService.get({ id: abp.session.userId });
    this.setState({
      permisssionsGranted: {
        update: (await utils.checkIfGrantedPermission('Categories.Update')).valueOf(),
        create: (await utils.checkIfGrantedPermission('Categories.Create')).valueOf(),
        activation: (await utils.checkIfGrantedPermission('Categories.Activation')).valueOf(),
        classificationsManagement: (
          await utils.checkIfGrantedPermission('Classifications')
        ).valueOf(),
      },
    });
    await this.props.newsCategoryStore?.getNewsCategories();
  }

  async openCategoryModal(entityDto: EntityDto): Promise<void> {
    if (entityDto.id === 0) {
      this.props.newsCategoryStore!.categoryModel = undefined;
      this.setState({ categoryModalType: 'create' });
    } else {
      await this.props.newsCategoryStore?.getNewsCategory(entityDto);
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

  createOrUpdateCategory = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.imageUrl = document.getElementById('category-image')!.getAttribute('value')
        ? document.getElementById('category-image')!.getAttribute('value')
        : this.props.newsCategoryStore?.categoryModel?.imageUrl;
      if (this.state.categoriesModalId === 0) {
        await this.props.newsCategoryStore?.createNewsCategory(values as CreateNewsCategoryDto);
      } else {
        values.id = this.state.categoriesModalId;
        await this.props.newsCategoryStore?.updateNewsCategory(values as UpdateNewsCategoryDto);
      }
      this.setState({ categoryModalVisible: false });
      form!.resetFields();
    });
  };

  onSwitchNewsCategoryActivation = async (item: NewsCategoryDto): Promise<void> => {
    popupConfirm(
      async () => {
        if (item.isActive) {
          await this.props.newsCategoryStore?.newsCategoryDeactivation({ id: item.id });
        } else await this.props.newsCategoryStore?.newsCategoryActivation({ id: item.id });
      },
      item.isActive
        ? L('AreYouSureYouWantToDeactivateThisNewsCategory')
        : L('AreYouSureYouWantToActivateThisNewsCategory')
    );
  };

  handleSearch = (_selectedKeys: any, confirm: any, _dataIndex: any) => {
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

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

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
    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string, item: NewsCategoryDto) => {
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
      render: (status: number) => {
        switch (+status) {
          case IsActive.Inactive:
            return (
              <Tag color="red" className="ant-tag-disable-pointer">
                {L('Inactive')}
              </Tag>
            );
          case IsActive.Active:
            return (
              <Tag color="green" className="ant-tag-disable-pointer">
                {L('Active')}
              </Tag>
            );
        }
        return null;
      },
    },
    {
      title: L('Action'),
      key: 'action',
      render: (_text: string, item: NewsCategoryDto) => (
        <div>
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
                  onClick={() => this.onSwitchNewsCategoryActivation(item)}
                />
              </Tooltip>
            ) : null
          ) : this.state.permisssionsGranted.activation ? (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.onSwitchNewsCategoryActivation(item)}
              />
            </Tooltip>
          ) : null}
        </div>
      ),
    },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (_page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      // this.updateCategoriesList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      // await this.updateCategoriesList(
      //   this.state.meta.pageSize,
      //   (page - 1) * this.state.meta.pageSize
      // );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const newsCategories = this.props.newsCategoryStore?.newsCategories;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.newsCategoryStore!.totalCount,
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
        <Table
          pagination={pagination}
          rowKey={(record) => `${record.id}`}
          style={{ marginTop: '12px' }}
          loading={this.props.newsCategoryStore?.loadingCategories}
          dataSource={newsCategories || []}
          columns={this.categoriesTableColumns}
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
                  <b>{L('NewsCount')}: </b>
                  {record.newsCount}
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
          isSubmittingCategory={this.props.newsCategoryStore!.isSubmittingCategory}
          newsCategoryStore={this.props.newsCategoryStore}
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

export default NewsCategories;
