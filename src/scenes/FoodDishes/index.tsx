/* eslint-disable */
import * as React from 'react';
import { Avatar, Button, Card, Table, Tag, Select, Row, Col, Tooltip, message } from 'antd';
import { inject, observer } from 'mobx-react';
import {
  CheckSquareOutlined,
  EditOutlined,
  PlusOutlined,
  FilterOutlined,
  StopOutlined,
  EyeOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import localization from '../../lib/localization';
import ImageModel from '../../components/ImageModal';
import userService from '../../services/user/userService';
import utils from '../../utils/utils';
import CreateOrUpdateDish from './components/createOrUpdateDish';
import FilterationBox from '../../components/FilterationBox';
import SearchColumnBox from '../../components/SearchColumnBox';
import Stores from '../../stores/storeIdentifier';
import FoodDishesStore from '../../stores/foodDishesStore';
import { FoodDishDto } from '../../services/foodDishes/dto/DishDto';
import { popupConfirm } from '../../lib/popupMessages';
// import { CreateFoodDishDto } from '../../services/foodDishes/dto/createDishDto';
// import { UpdateFoodDishDto } from '../../services/foodDishes/dto/updateDishDto';
import FoodCategoryStore from '../../stores/foodCategoryStore';
import timingHelper from '../../lib/timingHelper';
import DishDetails from './components/dishDetailsModal';

enum IsActiveStatus {
  Inactive = 0,
  Active = 1,
  Closed = 2,
}

export interface IDishesProps {
  foodDishesStore: FoodDishesStore;
  foodCategoryStore: FoodCategoryStore;
}

export interface IDishesState {
  dishModalVisible: boolean;
  dishesModalId: number;
  dishModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  dishDetailsModalVisible: boolean;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  permisssionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
  };
  statusFilter?: boolean;
  typeFilter?: any;
  keyword?: string;
  advancedSearchKeyword?: string;
  openSortDishesModal: boolean;
  dishModalId: number;
  dishModalOldStatus: number;
}

const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 6 },
  xl: { span: 6 },
  xxl: { span: 6 },
};

declare let abp: any;

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.FoodDishesStore, Stores.FoodCategoryStore)
@observer
export class FoodDishes extends AppComponentBase<IDishesProps, IDishesState> {
  formRef = React.createRef<FormInstance>();

  changeStatusFormRef = React.createRef<FormInstance>();

  currentUser: any = undefined;

  state = {
    dishModalVisible: false,
    dishesModalId: 0,
    dishModalType: 'create',
    dishDetailsModalVisible: false,
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
    typeFilter: undefined,
    keyword: undefined,
    advancedSearchKeyword: undefined,
    openSortDishesModal: false,
    changeStatusModalVisible: false,
    dishModalId: 0,
    dishModalOldStatus: 0,
  };

  async componentDidMount() {
    this.currentUser = await userService.get({ id: abp.session.userId });
    this.setState({
      permisssionsGranted: {
        update: (await utils.checkIfGrantedPermission('Events.Update')).valueOf(),
        create: (await utils.checkIfGrantedPermission('Events.Create')).valueOf(),
        activation: (await utils.checkIfGrantedPermission('Events.Activation')).valueOf(),
      },
    });

    this.updateFoodDishesList(this.state.meta.pageSize, 0);
  }

  // update FoodDishes list based on different properties
  async updateFoodDishesList(maxResultCount: number, skipCount: number, sorting?: string) {
    this.props.foodDishesStore!.maxResultCount = maxResultCount;
    this.props.foodDishesStore!.skipCount = skipCount;
    this.props.foodDishesStore!.statusFilter = this.state.statusFilter;
    this.props.foodDishesStore!.keyword = this.state.keyword;
    this.props.foodDishesStore!.advancedSearchKeyword = this.state.advancedSearchKeyword;
    this.props.foodDishesStore!.sorting = sorting;
    await this.props.foodDishesStore!.getAllFoodDishes();
  }

  async openDishModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.foodDishesStore!.foodDishesModel = undefined;
      this.setState({ dishModalType: 'create', dishesModalId: entityDto.id });
    } else {
      await this.props.foodDishesStore!.getFoodDish(entityDto);
      this.setState({ dishModalType: 'edit', dishesModalId: entityDto.id });
    }
    this.setState({
      dishModalVisible: !this.state.dishModalVisible,
      dishesModalId: entityDto.id,
    });
  }

  getIsActive(): Array<any> {
    return [
      {
        value: IsActiveStatus.Inactive,
        text: L('Inactive'),
      },
      {
        value: IsActiveStatus.Active,
        text: L('Active'),
      },
      {
        value: IsActiveStatus.Closed,
        text: L('Closed'),
      },
    ];
  }

  getColumnStatusSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
            this.setState({ statusFilter: value === 3 ? undefined : value });
          }}
          value={this.state.statusFilter === undefined ? 3 : this.state.statusFilter}
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
        <Button
          type="primary"
          onClick={async () => {
            confirm();
          }}
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({ statusFilter: undefined }, () => {});
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

  getColumnTypeSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          placeholder={L('PleaseSelectType')}
          optionFilterProp="children"
          filterOption={(input, option: any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          value={this.state.typeFilter}
          onChange={(value: any) => {
            this.setState({ typeFilter: value });
          }}
        >
          <Select.Option value={0} key={0}>
            {L('Main')}
          </Select.Option>
          <Select.Option value={1} key={1}>
            {L('Special')}
          </Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
          }}
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({ typeFilter: undefined }, () => {});
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

  prepend = (value: any, array: any) => {
    var newArray = array.slice();
    newArray.unshift(value);
    return newArray;
  };
  createOrUpdateDish = ({ arEditor, enEditor }: any) => {
    const form = this.formRef.current;
    form!
      .validateFields()
      .then(async (values: any) => {
        values.arAbout = arEditor.getData();
        values.enAbout = enEditor.getData();
        let totalNutritionsWeight = 0;
        values.nutritions?.length > 0 &&
          values.nutritions?.forEach((element: any) => {
            totalNutritionsWeight += +element.totalWeight;
            if (element.subNutritions && element.subNutritions.length > 0) {
              const sum = element.subNutritions.reduce((total: any, currentValue: any) => {
                return total + Number(currentValue.totalWeight);
              }, 0);

              if (Number(element.totalWeight) !== sum) {
                throw new Error(
                  `${L('SubNutritionWeightsNotMatchTotal')} ${element.name} ${L('Weight')}`
                );
              }
            }
          });
        let iterable = false;
        if (values.nutritions?.length > 0) iterable = true;
        if (this.state.dishesModalId === 0) {
          if (iterable)
            values.nutritions = [
              {
                name: 'Fat',
                nutritionType: 0,
                subNutritions: [],
                totalWeight: values.fatTotalWeight,
              },
              {
                name: 'Carbs',
                nutritionType: 0,
                subNutritions: [],
                totalWeight: values.carbsTotalWeight,
              },
              {
                name: 'Protein',
                nutritionType: 0,
                subNutritions: [],
                totalWeight: values.proteinTotalWeight,
              },
              ...values.nutritions,
            ];
          else
            values.nutritions = [
              {
                name: 'Fat',
                nutritionType: 0,
                subNutritions: [],
                totalWeight: values.fatTotalWeight,
              },
              {
                name: 'Carbs',
                nutritionType: 0,
                subNutritions: [],
                totalWeight: values.carbsTotalWeight,
              },
              {
                name: 'Protein',
                nutritionType: 0,
                subNutritions: [],
                totalWeight: values.proteinTotalWeight,
              },
            ];
          totalNutritionsWeight +=
            +values.proteinTotalWeight + +values.carbsTotalWeight + +values.fatTotalWeight;
          if (totalNutritionsWeight !== values.standardServingAmount) {
            throw new Error(`${L('MainNutritionWeightsNotMatchTotal')}`);
          }
          await this.props.foodDishesStore.createFoodDish(values);
        } else {
          values.id = this.state.dishesModalId;
          if (iterable)
            values.nutritions = [
              {
                name: 'Fat',
                nutritionType: 0,
                subNutritions: [],
                totalWeight: values.fatTotalWeight,
              },
              {
                name: 'Carbs',
                nutritionType: 0,
                subNutritions: [],
                totalWeight: values.carbsTotalWeight,
              },
              {
                name: 'Protein',
                nutritionType: 0,
                subNutritions: [],
                totalWeight: values.proteinTotalWeight,
              },
              ...values.nutritions!,
            ];
          else
            values.nutritions = [
              {
                name: 'Fat',
                nutritionType: 0,
                subNutritions: [],
                totalWeight: values.fatTotalWeight,
              },
              {
                name: 'Carbs',
                nutritionType: 0,
                subNutritions: [],
                totalWeight: values.carbsTotalWeight,
              },
              {
                name: 'Protein',
                nutritionType: 0,
                subNutritions: [],
                totalWeight: values.proteinTotalWeight,
              },
            ];
          totalNutritionsWeight +=
            +values.proteinTotalWeight + +values.carbsTotalWeight + +values.fatTotalWeight;
          if (totalNutritionsWeight !== values.standardServingAmount) {
            throw new Error(`${L('MainNutritionWeightsNotMatchTotal')}`);
          }
          await this.props.foodDishesStore.updateFoodDish(values);
        }
        this.updateFoodDishesList(this.state.meta.pageSize, 0);
        this.setState({ dishModalVisible: false });
        form!.resetFields();
      })
      .catch((err) => err.message && message.error(err.message));
  };

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  handleTableChange = (pagination: any, filters: any, sorter: any): void => {
    if (sorter.order === 'ascend') {
      this.updateFoodDishesList(this.state.meta.pageSize, 0, `${sorter.columnKey} ASC`);
    } else if (sorter.order === 'descend') {
      this.updateFoodDishesList(this.state.meta.pageSize, 0, `${sorter.columnKey} DESC`);
    } else {
      this.updateFoodDishesList(this.state.meta.pageSize, 0);
    }
  };

  onSwitchNewsActivation = async (dish: FoodDishDto) => {
    popupConfirm(
      async () => {
        if (dish.isActive) await this.props.foodDishesStore!.foodDishDeactivation({ id: dish.id });
        else await this.props.foodDishesStore!.foodDishActivation({ id: dish.id });
        await this.updateFoodDishesList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      dish.isActive
        ? L('AreYouSureYouWantToDeactivateThisDish')
        : L('AreYouSureYouWantToActivateThisDish')
    );
  };

  // handle open dish details modal
  async openDishDetailsModal(entity: EntityDto) {
    this.props.foodDishesStore!.getFoodDish(entity);
    this.setState({
      dishDetailsModalVisible: !this.state.dishDetailsModalVisible,
    });
  }

  dishesTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
      ...SearchColumnBox.getColumnSearchProps(
        'name',
        (search: string) => this.setState({ advancedSearchKeyword: search }),
        () => this.updateFoodDishesList(this.state.meta.pageSize, 0),
        () => this.forceUpdate()
      ),
    },

    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (coverUrl: string, item: FoodDishDto) => {
        return (
          <div
            onClick={() => this.openImageModal(item.imageUrl!, item.enName)}
            style={{ display: 'inline-block', cursor: 'zoom-in' }}
          >
            <Avatar shape="square" size={50} src={coverUrl} />
          </div>
        );
      },
    },
    {
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: number) => {
        if (isActive) {
          return (
            <Tag color="green" className="ant-tag-disable-pointer">
              {L('Active')}
            </Tag>
          );
        }
        return (
          <Tag color="red" className="ant-tag-disable-pointer">
            {L('Inactive')}
          </Tag>
        );
      },
    },
    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: any) => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon"
              onClick={() => this.openDishDetailsModal({ id: item.id })}
            />
          </Tooltip>
          {this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon"
                onClick={() => this.openDishModal({ id: item.id })}
              />
            </Tooltip>
          ) : null}
          {item.isActive ? (
            this.state.permisssionsGranted.activation ? (
              <Tooltip title={L('Deactivate')}>
                <StopOutlined
                  className="action-icon red-text"
                  onClick={() => this.onSwitchNewsActivation(item)}
                />
              </Tooltip>
            ) : null
          ) : this.state.permisssionsGranted.activation ? (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon green-text"
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

  compare = (a: any, b: any) => {
    if (a.order < b.order) {
      return -1;
    }
    if (a.order > b.order) {
      return 1;
    }
    return 0;
  };

  public render() {
    const { foodDishes } = this.props.foodDishesStore!;
    const pagination = {
      ...this.paginationOptions,
      total: 0,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Dishes')}</span>
            {this.state.permisssionsGranted.create ? (
              <Button
                type="primary"
                style={{ float: localization.getFloat(), margin: '0 5px' }}
                icon={<PlusOutlined />}
                onClick={() => this.openDishModal({ id: 0 })}
              >
                {L('AddDish')}
              </Button>
            ) : null}
          </div>
        }
      >
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
                <Select.Option key={1} value>
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
                await this.updateFoodDishesList(
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
                  await this.updateFoodDishesList(
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
          dataSource={foodDishes || []}
          columns={this.dishesTableColumns}
          loading={this.props.foodDishesStore!.loadingFoodDishes}
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
                  <b>{`${L('AmountOfCalories')} (${L('kcal')})`}: </b>
                  {record.amountOfCalories}
                </span>
                <span>
                  <b>{`${L('StandardServingAmount')} (${L('Grams')})`}: </b>
                  {record.standardServingAmount}
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

        <CreateOrUpdateDish
          formRef={this.formRef}
          visible={this.state.dishModalVisible}
          onCancel={() =>
            this.setState({
              dishModalVisible: false,
            })
          }
          modalType={this.state.dishModalType}
          onOk={this.createOrUpdateDish}
          isSubmittingDish={this.props.foodDishesStore.isSubmittingFoodDishes}
          foodDishesStore={this.props.foodDishesStore}
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

        <DishDetails
          visible={this.state.dishDetailsModalVisible}
          onCancel={() => {
            this.setState({
              dishDetailsModalVisible: false,
            });
            this.props.foodDishesStore!.foodDishesModel = undefined;
          }}
          loading={this.props.foodDishesStore.isSubmittingFoodDishes}
          foodDishesModel={this.props.foodDishesStore!.foodDishesModel}
        />
      </Card>
    );
  }
}

export default FoodDishes;
