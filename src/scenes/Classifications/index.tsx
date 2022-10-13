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
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import localization from '../../lib/localization';
import ImageModel from '../../components/ImageModal';
import SearchComponent from '../../components/SearchComponent';
import ClassificationStore from '../../stores/classificationStore';
import { CreateClassificationDto } from '../../services/classifications/dto/createClassificationDto';
import { UpdateClassificationDto } from '../../services/classifications/dto/updateClassificationDto';
import { ClassificationDto } from '../../services/classifications/dto/classificationDto';
import CreateOrUpdateClassification from './components/createOrUpdateClassification';
import userService from '../../services/user/userService';
import utils from '../../utils/utils';
import ClassificationDetailsModal from './components/classificationDetailsModal';
import { LiteEntityDto } from '../../services/locations/dto/liteEntityDto';
import categoriesService from '../../services/categories/categoriesService';
import FilterationBox from '../../components/FilterationBox';
import ChangeStatusModal from '../../components/ChangeStatusModal';
import { popupConfirm } from '../../lib/popupMessages';
import { getIsActiveWithShopStatusOptions } from '../../lib/types';

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
export interface IClassificationsProps {
  classificationStore: ClassificationStore;
}

export interface IClassificationsState {
  classificationModalVisible: boolean;
  classificationsModalId: number;
  classificationModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  classificationDetailsModalVisible: boolean;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  permisssionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
  };
  statusFilter?: boolean;
  categoryIdFilter?: number;
  keyword?: string;
  classificationModalId: number;
  classificationModalOldStatus: number;
  changeStatusModalVisible: boolean;
}

declare let abp: any;

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.ClassificationStore)
@observer
export class Classifications extends AppComponentBase<
  IClassificationsProps,
  IClassificationsState
> {
  formRef = React.createRef<FormInstance>();

  changeStatusFormRef = React.createRef<FormInstance>();

  currentUser: any = undefined;

  categories: LiteEntityDto[] = [];

  state = {
    classificationModalVisible: false,
    classificationsModalId: 0,
    classificationModalType: 'create',
    classificationDetailsModalVisible: false,
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
    statusFilter: undefined,
    categoryIdFilter: undefined,
    keyword: undefined,
    changeStatusModalVisible: false,
    classificationModalId: 0,
    classificationModalOldStatus: 0,
  };

  async componentDidMount() {
    this.currentUser = await userService.get({ id: abp.session.userId });
    const result = await categoriesService.getAllLite();
    this.categories = result.items;
    this.setState({
      permisssionsGranted: {
        update: (await utils.checkIfGrantedPermission('Classifications.Update')).valueOf(),
        create: (await utils.checkIfGrantedPermission('Classifications.Create')).valueOf(),
        activation: (await utils.checkIfGrantedPermission('Classifications.Activation')).valueOf(),
      },
    });
    this.updateClassificationsList(this.state.meta.pageSize, 0);
  }

  async updateClassificationsList(maxResultCount: number, skipCount: number) {
    this.props.classificationStore!.maxResultCount = maxResultCount;
    this.props.classificationStore!.skipCount = skipCount;
    this.props.classificationStore!.statusFilter = this.state.statusFilter;
    this.props.classificationStore!.categoryIdFilter = this.state.categoryIdFilter;
    this.props.classificationStore!.keyword = this.state.keyword;
    this.props.classificationStore!.getClassifications();
  }

  async openClassificationModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.classificationStore!.classificationModel = undefined;
      this.setState({ classificationModalType: 'create' });
    } else {
      await this.props.classificationStore!.getClassification(entityDto);
      this.setState({ classificationModalType: 'edit' });
    }
    this.setState({
      classificationModalVisible: !this.state.classificationModalVisible,
      classificationsModalId: entityDto.id,
    });
  }

  async openClassificationDetailsModal(entityDto: EntityDto) {
    await this.props.classificationStore!.getClassification(entityDto);
    this.setState({
      classificationDetailsModalVisible: !this.state.classificationDetailsModalVisible,
      classificationsModalId: entityDto.id,
    });
  }

  createOrUpdateClassification = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.categoryId = parseInt(values.categoryId);
      values.imageUrl = document.getElementById('classification-image')!.getAttribute('value')
        ? document.getElementById('classification-image')!.getAttribute('value')
        : this.props.classificationStore!.classificationModel?.imageUrl;
      if (this.state.classificationsModalId === 0) {
        await this.props.classificationStore!.createClassification(
          values as CreateClassificationDto
        );
      } else {
        values.id = this.state.classificationsModalId;

        await this.props.classificationStore!.updateClassification(
          values as UpdateClassificationDto
        );
      }
      await this.updateClassificationsList(this.state.meta.pageSize, this.state.meta.skipCount);
      this.setState({ classificationModalVisible: false });
      form!.resetFields();
    });
  };

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  openChangeStatusModal(id: number, oldStatus: number) {
    this.setState({
      classificationModalId: id,
      classificationModalOldStatus: oldStatus,
      changeStatusModalVisible: true,
    });
  }

  doneClassificationChangeStatus = () => {
    this.updateClassificationsList(this.state.meta.pageSize, 0);
  };

  changeStatus = async (item: ClassificationDto) => {
    popupConfirm(
      async () => {
        if (!item.isActive) {
          await this.props.classificationStore!.classificationActivation({ id: item.id });
        } else {
          await this.props.classificationStore!.classificationDeactivation({ id: item.id });
        }
        await this.updateClassificationsList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      item.isActive
        ? L('AreYouSureYouWantToDeactivateThisClassification')
        : L('AreYouSureYouWantToActivateThisClassification')
    );
  };

  classificationsTableColumns = [
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
      title: L('Category'),
      dataIndex: 'category',
      key: 'category',
      render: (category: string, item: ClassificationDto) => {
        return item.category.text;
      },
    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string, item: ClassificationDto) => {
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
      render: (text: string, item: ClassificationDto) => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon"
              onClick={() => this.openClassificationDetailsModal({ id: item.id })}
            />
          </Tooltip>
          {this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon"
                onClick={() => this.openClassificationModal({ id: item.id })}
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
      this.updateClassificationsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateClassificationsList(
        this.state.meta.pageSize,
        (page - 1) * this.state.meta.pageSize
      );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const { classifications } = this.props.classificationStore!;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.classificationStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Classifications')}</span>
            {this.state.permisssionsGranted.create ? (
              <Button
                type="primary"
                style={{ float: localization.getFloat() }}
                icon={<PlusOutlined />}
                onClick={() => this.openClassificationModal({ id: 0 })}
              >
                {L('AddClassification')}
              </Button>
            ) : null}
          </div>
        }
      >
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateClassificationsList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />
        <FilterationBox>
          <Row>
            <Col {...filterationColLayout}>
              <label>{L('Category')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                allowClear
                placeholder={L('PleaseSelectCategory')}
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={this.state.categoryIdFilter}
                onChange={(value: any) => {
                  this.setState({ categoryIdFilter: value });
                }}
              >
                {this.categories.length > 0 &&
                  this.categories.map((element: LiteEntityDto) => (
                    <Select.Option key={element.value} value={element.value}>
                      {element.text}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
            <Col {...filterationColLayout2}>
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
                await this.updateClassificationsList(
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
                this.setState(
                  { statusFilter: undefined, categoryIdFilter: undefined },
                  async () => {
                    await this.updateClassificationsList(
                      this.state.meta.pageSize,
                      this.state.meta.skipCount
                    );
                  }
                );
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
          loading={this.props.classificationStore!.loadingClassifications}
          dataSource={classifications === undefined ? [] : classifications}
          columns={this.classificationsTableColumns}
        />

        <CreateOrUpdateClassification
          formRef={this.formRef}
          visible={this.state.classificationModalVisible}
          onCancel={() =>
            this.setState({
              classificationModalVisible: false,
            })
          }
          modalType={this.state.classificationModalType}
          onOk={this.createOrUpdateClassification}
          isSubmittingClassification={this.props.classificationStore!.isSubmittingClassification}
          classificationStore={this.props.classificationStore}
        />

        <ImageModel
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => {
            this.closeImageModal();
          }}
        />

        <ClassificationDetailsModal
          visible={this.state.classificationDetailsModalVisible}
          onCancel={() =>
            this.setState({
              classificationDetailsModalVisible: false,
            })
          }
          classificationStore={this.props.classificationStore!}
        />

        <ChangeStatusModal
          formRef={this.changeStatusFormRef}
          isOpen={this.state.changeStatusModalVisible}
          id={this.state.classificationModalId}
          oldStatus={this.state.classificationModalOldStatus}
          service="Classification"
          onDone={this.doneClassificationChangeStatus}
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

export default Classifications;
