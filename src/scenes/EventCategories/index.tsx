/* eslint-disable */
import * as React from 'react';
import { Card, Table, Tag, Tooltip, Button, Select, Row, Col } from 'antd';
import { inject, observer } from 'mobx-react';
import { FormInstance } from 'antd/lib/form';
import { EditOutlined, StopOutlined, PlusOutlined, CheckSquareOutlined } from '@ant-design/icons';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { popupConfirm } from '../../lib/popupMessages';
import EventCategoryStore from '../../stores/eventCategoryStore';
import { EventCategoryDto, CreateOrUpdateEventCategoryDto } from '../../services/eventCategory/dto';
import CreateOrUpdateEventCategory from './components/EventCategoryCreateOrUpdate';
import { isGranted } from '../../lib/abpUtility';
import FiltrationBox from '../../components/FilterationBox';

export interface IEventCategoriesProps {
  eventCategoryStore?: EventCategoryStore;
}

export interface IEventCategoriesState {
  eventCategoryModalVisible: boolean;
  eventCategory?: EventCategoryDto;
  eventCategoryModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    skipCount: number;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
  };
  permissionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
  };
  keyword?: string;
  isActiveFilter?: boolean;
}

const INDEX_PAGE_SIZE_DEFAULT = 12;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.EventCategoryStore)
@observer
export class EventCategories extends AppComponentBase<
  IEventCategoriesProps,
  IEventCategoriesState
> {
  resetPasswordFormRef = React.createRef<FormInstance>();

  state = {
    eventCategoryModalType: 'create',
    eventCategoryModalVisible: false,
    eventCategory: undefined,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      skipCount: 0,
      total: 0,
    },
    permissionsGranted: {
      update: false,
      create: false,
      activation: false,
    },
    keyword: undefined,
    isActiveFilter: undefined,
  };

  // set the state of permissions
  async componentDidMount(): Promise<void> {
    this.setState({
      permissionsGranted: {
        update: isGranted('EventCategories.Update'),
        create: isGranted('EventCategories.Create'),
        activation: isGranted('EventCategories.Activation'),
      },
    });

    await this.updateEventCategoriesList(this.state.meta.pageSize, 0);
  }

  // update the event organizers list
  updateEventCategoriesList = async (maxResultCount: number, skipCount: number): Promise<void> => {
    const { eventCategoryStore } = this.props!;
    eventCategoryStore!.maxResultCount = maxResultCount;
    eventCategoryStore!.skipCount = skipCount;
    eventCategoryStore!.isActiveFilter = this.state.isActiveFilter;
    eventCategoryStore!.keyword = this.state.keyword;
    eventCategoryStore!.getEventCatagories();
  };

  // open event organizer details modal
  openCreateOrUpdateEventCategoryModal = async (
    eventCategory?: EventCategoryDto
  ): Promise<void> => {
    if (eventCategory) {
      this.setState({
        eventCategory,
        eventCategoryModalType: 'update',
        eventCategoryModalVisible: true,
      });
    } else {
      this.setState({
        eventCategory: undefined,
        eventCategoryModalType: 'create',
        eventCategoryModalVisible: true,
      });
    }
  };

  // event organizer activation and deactivation
  onSwitchOrganizerActivation = async (category: EventCategoryDto): Promise<void> => {
    popupConfirm(
      async () => {
        if (category.isActive) {
          await this.props.eventCategoryStore!.categoryDeactivation({ id: category.id });
        } else await this.props.eventCategoryStore!.categoryActivation({ id: category.id });
        await this.updateEventCategoriesList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      category.isActive
        ? L('AreYouSureYouWantToBlockThisEventCategory')
        : L('AreYouSureYouWantToActivateThisEventCategory')
    );
  };

  // handle create or update event category
  handleCreateOrUpdateEventCategory = async (
    values: CreateOrUpdateEventCategoryDto
  ): Promise<void> => {
    const { eventCategoryModalType } = this.state;
    if (eventCategoryModalType === 'update' && values.id) {
      await this.props.eventCategoryStore!.updateEventCategory(values);
    } else {
      await this.props.eventCategoryStore!.createEventCategory(values);
    }
    await this.updateEventCategoriesList(this.state.meta.pageSize, this.state.meta.skipCount);
    this.setState({ eventCategoryModalVisible: false, eventCategory: undefined });
  };

  // event Organizers Table Columns
  eventCategoriesTableColumns = [
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
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: number): JSX.Element => (
        <Tag color={isActive ? 'green' : 'volcano'} className="ant-tag-disable-pointer">
          {isActive ? L('Active') : L('Inactive')}
        </Tag>
      ),
    },
    {
      title: L('Action'),
      key: 'action',
      render: (_1: unknown, item: EventCategoryDto): JSX.Element => {
        const {
          permissionsGranted: { activation, update },
        } = this.state;
        return (
          <div>
            {activation && item.isActive && (
              <Tooltip title={L('Block')}>
                <StopOutlined
                  className="action-icon red-text"
                  onClick={() => this.onSwitchOrganizerActivation(item)}
                />
              </Tooltip>
            )}
            {activation && !item.isActive && (
              <Tooltip title={L('Activate')}>
                <CheckSquareOutlined
                  className="action-icon  green-text"
                  onClick={() => this.onSwitchOrganizerActivation(item)}
                />
              </Tooltip>
            )}
            {update && (
              <Tooltip title={L('Edit')}>
                <EditOutlined
                  className="action-icon"
                  onClick={() => this.openCreateOrUpdateEventCategoryModal(item)}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: number, pageSize: number): Promise<void> => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateEventCategoriesList(pageSize, 0);
    },
    onChange: async (page: number): Promise<void> => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateEventCategoriesList(
        this.state.meta.pageSize,
        (page - 1) * this.state.meta.pageSize
      );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: number, range: number[]): string =>
      `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const { eventCatagories, loadingCatagories, totalCount, isSubmittingCategory } =
      this.props.eventCategoryStore!;
    const {
      meta: { page, pageSize },
      isActiveFilter,
      eventCategoryModalType,
      eventCategoryModalVisible,
      eventCategory,
      permissionsGranted: { create },
    } = this.state;
    const pagination = {
      ...this.paginationOptions,
      total: totalCount,
      current: page,
      pageSize,
    };
    return (
      <Card
        title={
          <div className="page-head">
            <span>{L('EventCategories')}</span>
            {create && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => this.openCreateOrUpdateEventCategoryModal()}
              >
                {L('CreateEventCategory')}
              </Button>
            )}
          </div>
        }
      >
        <FiltrationBox>
          <Row>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
              xl={{ span: 8 }}
            >
              <label>{L('IsActive')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                optionFilterProp="children"
                onChange={(value: boolean) => {
                  this.setState({
                    isActiveFilter: value,
                  });
                }}
                placeholder={L('SelectStatus')}
                value={isActiveFilter}
              >
                <Select.Option key={0} value={true}>
                  {L('Active')}
                </Select.Option>
                <Select.Option key={1} value={false}>
                  {L('Inactive')}
                </Select.Option>
              </Select>
            </Col>
          </Row>
          <div className="btns-wrap">
            <Button
              type="primary"
              onClick={async () => {
                await this.updateEventCategoriesList(
                  this.state.meta.pageSize,
                  this.state.meta.skipCount
                );
              }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ isActiveFilter: undefined }, async () => {
                  await this.updateEventCategoriesList(
                    this.state.meta.pageSize,
                    this.state.meta.skipCount
                  );
                });
              }}
            >
              {L('ResetFilter')}
            </Button>
          </div>
        </FiltrationBox>
        <Table
          pagination={pagination}
          rowKey={(record) => `${record.id}`}
          loading={loadingCatagories}
          dataSource={eventCatagories ?? []}
          columns={this.eventCategoriesTableColumns}
        />
        {eventCategoryModalVisible && (
          <CreateOrUpdateEventCategory
            onCancel={() =>
              this.setState({ eventCategory: undefined, eventCategoryModalVisible: false })
            }
            visible={eventCategoryModalVisible}
            onOk={this.handleCreateOrUpdateEventCategory}
            categoryData={eventCategory}
            modalType={eventCategoryModalType}
            isSubmittingEventCategory={isSubmittingCategory}
          />
        )}
      </Card>
    );
  }
}

export default EventCategories;
