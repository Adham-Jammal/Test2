/* eslint-disable */
import * as React from 'react';
import { Button, Card, Table, Tag, Select, Row, Col, Tooltip, message, Avatar } from 'antd';
import { inject, observer } from 'mobx-react';
import {
  CheckSquareOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  StopOutlined,
  UpOutlined,
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
import CreateOrUpdateRecipe from './components/createOrUpdateRecipe';
import FilterationBox from '../../components/FilterationBox';
import ChangeStatusModal from '../../components/ChangeStatusModal';
// import { Link } from 'react-router-dom';
import SearchColumnBox from '../../components/SearchColumnBox';
import Stores from '../../stores/storeIdentifier';
import FoodRecipesStore from '../../stores/foodRecipeStore';
import { popupConfirm } from '../../lib/popupMessages';
import { FoodRecipeDto } from '../../services/foodRecipe/dto/recipeDto';
import { CreateFoodRecipeDto } from '../../services/foodRecipe/dto/createRecipeDto';
import { UpdateFoodRecipeDto } from '../../services/foodRecipe/dto/updateRecipeDto';
import FoodCategoryStore from '../../stores/foodCategoryStore';
import timingHelper from '../../lib/timingHelper';
import RecipeDetails from './components/recipeDetailsModal';

enum IsActiveStatus {
  Inactive = 0,
  Active = 1,
  Closed = 2,
}

export interface IRecipeProps {
  foodRecipesStore: FoodRecipesStore;
  foodCategoryStore: FoodCategoryStore;
}

export interface IRecipeState {
  recipeModalVisible: boolean;
  recipesModalId: number;
  recipeModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  recipeDetailsModalVisible: boolean;
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
  openSortRecipesModal: boolean;
  recipeModalId: number;
  recipeModalOldStatus: number;
  changeStatusModalVisible: boolean;
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

@inject(Stores.FoodRecipesStore, Stores.FoodCategoryStore)
@observer
export class FoodRecipes extends AppComponentBase<IRecipeProps, IRecipeState> {
  formRef = React.createRef<FormInstance>();

  changeStatusFormRef = React.createRef<FormInstance>();

  currentUser: any = undefined;

  state = {
    recipeModalVisible: false,
    recipesModalId: 0,
    recipeModalType: 'create',
    recipeDetailsModalVisible: false,
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
    openSortRecipesModal: false,
    changeStatusModalVisible: false,
    recipeModalId: 0,
    recipeModalOldStatus: 0,
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

    this.updateFoodRecipeList(this.state.meta.pageSize, 0);
  }

  // update FoodRecipe list based on different properties
  async updateFoodRecipeList(maxResultCount: number, skipCount: number, sorting?: string) {
    this.props.foodRecipesStore!.maxResultCount = maxResultCount;
    this.props.foodRecipesStore!.skipCount = skipCount;
    this.props.foodRecipesStore!.IsActive = this.state.statusFilter;
    this.props.foodRecipesStore!.keyword = this.state.keyword;
    this.props.foodRecipesStore!.advancedSearchKeyword = this.state.advancedSearchKeyword;
    this.props.foodRecipesStore!.sorting = sorting;
    await this.props.foodRecipesStore!.getAllFoodRecipes();
  }

  async openRecipeModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.foodRecipesStore!.foodRecipesModel = undefined;
      this.setState({ recipeModalType: 'create', recipesModalId: entityDto.id });
    } else {
      await this.props.foodRecipesStore!.getFoodRecipe(entityDto);
      this.setState({ recipeModalType: 'edit', recipesModalId: entityDto.id });
    }
    this.setState({
      recipeModalVisible: !this.state.recipeModalVisible,
      recipesModalId: entityDto.id,
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

  createOrUpdateRecipe = ({ arEditor, enEditor }: any) => {
    const form = this.formRef.current;
    form!
      .validateFields()
      .then(async (values: any) => {
        values.arAbout = arEditor.getData();
        values.enAbout = enEditor.getData();
        let totalNutritionsWeight = 0;
        values.nutritions &&
          values.nutritions.forEach((element: any) => {
            totalNutritionsWeight += +element.totalWeight;
            const sum = element.subNutritions.reduce((total: any, currentValue: any) => {
              return total + Number(currentValue.totalWeight);
            }, 0);

            if (Number(element.totalWeight) !== sum) {
              throw new Error(
                `${L('SubNutritionWeightsNotMatchTotal')} ${element.name} ${L('Weight')}`
              );
            }
          });
        if (totalNutritionsWeight !== values.standardServingAmount) {
          throw new Error(`${L('MainNutritionWeightsNotMatchTotal')}`);
        }
        if (this.state.recipesModalId === 0) {
          await this.props.foodRecipesStore.createFoodRecipe(values as CreateFoodRecipeDto);
        } else {
          values.id = this.state.recipesModalId;
          await this.props.foodRecipesStore.updateFoodRecipe(values as UpdateFoodRecipeDto);
        }
        this.updateFoodRecipeList(this.state.meta.pageSize, 0);
        this.setState({ recipeModalVisible: false });
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

  openChangeStatusModal(id: number, oldStatus: number) {
    this.setState({
      recipeModalId: id,
      recipeModalOldStatus: oldStatus,
      changeStatusModalVisible: true,
    });
  }

  handleTableChange = (pagination: any, filters: any, sorter: any): void => {
    if (sorter.order === 'ascend') {
      this.updateFoodRecipeList(this.state.meta.pageSize, 0, `${sorter.columnKey} ASC`);
    } else if (sorter.order === 'descend') {
      this.updateFoodRecipeList(this.state.meta.pageSize, 0, `${sorter.columnKey} DESC`);
    } else {
      this.updateFoodRecipeList(this.state.meta.pageSize, 0);
    }
  };

  onSwitchNewsActivation = async (recipe: FoodRecipeDto) => {
    popupConfirm(
      async () => {
        if (recipe.isActive) {
          await this.props.foodRecipesStore!.foodRecipeDeactivation({ id: recipe.id });
        } else await this.props.foodRecipesStore!.foodRecipeActivation({ id: recipe.id });
        await this.updateFoodRecipeList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      recipe.isActive
        ? L('AreYouSureYouWantToDeactivateThisRecipe')
        : L('AreYouSureYouWantToActivateThisRecipe')
    );
  };

  async openDetailsModal(entity: EntityDto) {
    this.props.foodRecipesStore!.getFoodRecipe(entity);
    this.setState({
      recipeDetailsModalVisible: !this.state.recipeDetailsModalVisible,
    });
  }

  recipesTableColumns = [
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
        () => this.updateFoodRecipeList(this.state.meta.pageSize, 0),
        () => this.forceUpdate()
      ),
    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (coverUrl: string, item: FoodRecipeDto) => {
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
              onClick={() => this.openDetailsModal({ id: item.id })}
            />
          </Tooltip>
          {this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon"
                onClick={() => this.openRecipeModal({ id: item.id })}
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
    const { foodRecipes } = this.props.foodRecipesStore!;
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
            <span>{L('Recipes')}</span>
            {this.state.permisssionsGranted.create ? (
              <Button
                type="primary"
                style={{ float: localization.getFloat(), margin: '0 5px' }}
                icon={<PlusOutlined />}
                onClick={() => this.openRecipeModal({ id: 0 })}
              >
                {L('AddRecipe')}
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
                await this.updateFoodRecipeList(
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
                  await this.updateFoodRecipeList(
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
          dataSource={foodRecipes || []}
          columns={this.recipesTableColumns}
          loading={this.props.foodRecipesStore!.loadingFoodRecipes}
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
                  <b>{`${L('RecipePeriodTime')} (${L('Minutes')})`}: </b>
                  {record.periodTime}
                </span>
                <span>
                  <b>{`${L('FoodRecipeCalories')} (${L('kcal')})`}: </b>
                  {record.amountOfCalories}
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

        <CreateOrUpdateRecipe
          formRef={this.formRef}
          visible={this.state.recipeModalVisible}
          onCancel={() =>
            this.setState({
              recipeModalVisible: false,
            })
          }
          modalType={this.state.recipeModalType}
          onOk={this.createOrUpdateRecipe}
          isSubmittingRecipe={this.props.foodRecipesStore!.isSubmittingFoodRecipes}
          foodRecipesStore={this.props.foodRecipesStore}
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

        <ChangeStatusModal
          formRef={this.changeStatusFormRef}
          isOpen={this.state.changeStatusModalVisible}
          id={this.state.recipeModalId}
          oldStatus={this.state.recipeModalOldStatus}
          service="Recipe"
          onDone={() => {}}
          options={this.getIsActive()}
          onClose={() =>
            this.setState({
              changeStatusModalVisible: false,
            })
          }
        />
        <RecipeDetails
          visible={this.state.recipeDetailsModalVisible}
          onCancel={() => {
            this.setState({
              recipeDetailsModalVisible: false,
            });
            this.props.foodRecipesStore!.foodRecipesModel = undefined;
          }}
          loading={this.props.foodRecipesStore.isSubmittingFoodRecipes}
          foodRecipesModel={this.props.foodRecipesStore!.foodRecipesModel!}
        />
      </Card>
    );
  }
}

export default FoodRecipes;
