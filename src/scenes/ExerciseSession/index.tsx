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
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import localization from '../../lib/localization';
import ImageModel from '../../components/ImageModal';
import userService from '../../services/user/userService';
import FilterationBox from '../../components/FilterationBox';
import SearchColumnBox from '../../components/SearchColumnBox';
import utils from '../../utils/utils';
import CreateOrUpdateSession from './components/createOrUpdateSession';
import { EntityDto } from '../../services/dto/entityDto';
import Stores from '../../stores/storeIdentifier';
import SessionStore from '../../stores/sessionStore';
import { CreateSessiontDto } from '../../services/session/dto/createSessionDto';
import { popupConfirm } from '../../lib/popupMessages';
import { SessionDto } from '../../services/session/dto/sessionDto';
import ExerciseStore from '../../stores/exerciseStore';
import { UpdateSessiontDto } from '../../services/session/dto/updateSessionDto';
import { ExerciseDto } from '../../services/exercise/dto/exerciseDto';
import timingHelper from '../../lib/timingHelper';
import moment from 'moment';
import SessionDetails from './components/SessionDetails';

const filterationColLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 7 },
  xl: { span: 7 },
  xxl: { span: 7 },
};

export interface IExerciseSessionProps {
  sessionStore: SessionStore;
  exerciseStore: ExerciseStore;
}

export interface IExerciseSessionState {
  exerciseSessionModalVisible: boolean;
  exerciseSessionModalId: number;
  exerciseSessionModalType: string;
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
  permisssionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
  };
  isActiveFilter?: boolean;
  keyword?: string;
  advancedSearchKeyword: string;
  searchedColumns: string[];
  statusFilter?: number;
  sessionDetailsData?: SessionDto;
  sessionDetailsModalVisible: boolean;
}

declare let abp: any;

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.SessionStore, Stores.ExerciseStore)
@observer
export class ExerciseSession extends AppComponentBase<
  IExerciseSessionProps,
  IExerciseSessionState
> {
  formRef = React.createRef<FormInstance>();

  currentUser: any = undefined;

  state = {
    exerciseSessionModalVisible: false,
    exerciseSessionModalId: 0,
    exerciseSessionModalType: 'create',
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
    statusFilter: undefined,
    sessionDetailsData: undefined,
    sessionDetailsModalVisible: false,
  };

  openSessionDetailsModal = (data: SessionDto): void => {
    this.setState({
      sessionDetailsModalVisible: true,
      sessionDetailsData: data,
    });
  };

  searchInput: any;

  async componentDidMount() {
    this.currentUser = await userService.get({ id: abp.session.userId });
    this.setState({
      permisssionsGranted: {
        update: (await utils.checkIfGrantedPermission('Events.Update')).valueOf(),
        create: (await utils.checkIfGrantedPermission('Events.Create')).valueOf(),
        activation: (await utils.checkIfGrantedPermission('Events.Activation')).valueOf(),
      },
    });
    this.updateSessionsList(this.state.meta.pageSize, 0);
  }

  // update session list based on different properties
  async updateSessionsList(maxResultCount: number, skipCount: number, sorting?: string) {
    this.props.sessionStore!.maxResultCount = maxResultCount;
    this.props.sessionStore!.skipCount = skipCount;
    this.props.sessionStore!.statusFilter = this.state.statusFilter;
    this.props.sessionStore!.keyword = this.state.keyword;
    this.props.sessionStore!.advancedSearchKeyword = this.state.advancedSearchKeyword;
    this.props.sessionStore!.sorting = sorting;
    await this.props.sessionStore!.getAllSessions();
  }

  async openExerciseSessionModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.sessionStore!.sessionModel = undefined;
      this.setState({ exerciseSessionModalType: 'create' });
    } else {
      await this.props.sessionStore!.getSession(entityDto);
      this.setState({ exerciseSessionModalType: 'edit' });
    }
    this.setState({
      exerciseSessionModalVisible: !this.state.exerciseSessionModalVisible,
      exerciseSessionModalId: entityDto.id,
    });
  }

  createOrUpdateExerciseSession = ({ arEditor, enEditor }: any) => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.arDescription = arEditor?.getData();
      values.enDescription = enEditor?.getData();
      values.imageUrl = document.getElementById('session-image')!.getAttribute('value')
        ? document.getElementById('session-image')!.getAttribute('value')
        : this.props.sessionStore!.sessionModel?.imageUrl;

      if (this.state.exerciseSessionModalId === 0) {
        await this.props.sessionStore!.createSession(values as CreateSessiontDto);
      } else {
        values.id = this.state.exerciseSessionModalId;
        await this.props.sessionStore!.updateSession(values as UpdateSessiontDto);
      }
      await this.updateSessionsList(this.state.meta.pageSize, this.state.meta.skipCount);
      this.setState({ exerciseSessionModalVisible: false });
      form!.resetFields();
    });
  };

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  handleTableChange = (pagination: any, filters: any, sorter: any): void => {
    if (sorter.order === 'ascend') {
      this.updateSessionsList(this.state.meta.pageSize, 0, `${sorter.columnKey} ASC`);
    } else if (sorter.order === 'descend') {
      this.updateSessionsList(this.state.meta.pageSize, 0, `${sorter.columnKey} DESC`);
    } else {
      this.updateSessionsList(this.state.meta.pageSize, 0);
    }
  };

  onSwitchNewsActivation = async (session: SessionDto) => {
    popupConfirm(
      async () => {
        if (session.isActive) {
          await this.props.sessionStore!.sessionDeactivation({ id: session.id });
        } else await this.props.sessionStore!.sessionActivation({ id: session.id });
        await this.updateSessionsList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      session.isActive
        ? L('AreYouSureYouWantToDeactivateThisSession')
        : L('AreYouSureYouWantToActivateThisSession')
    );
  };

  exerciseTableColumns = [
    { title: L('ID'), dataIndex: 'id', key: 'id' },
    {
      title: L('Title'),
      dataIndex: 'title',
      key: 'title',
      ...SearchColumnBox.getColumnSearchProps(
        'title',
        (search: string) => this.setState({ advancedSearchKeyword: search }),
        () => this.updateSessionsList(this.state.meta.pageSize, 0),
        () => this.forceUpdate()
      ),
    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string) => {
        return (
          <div
            onClick={() => this.openImageModal(imageUrl, imageUrl)}
            style={{ display: 'inline-block', cursor: 'zoom-in' }}
          >
            <Avatar shape="square" size={50} src={imageUrl} />
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
      render: (text: string, item: SessionDto) => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon "
              onClick={() => this.openSessionDetailsModal(item)}
            />
          </Tooltip>
          {this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon "
                onClick={() => this.openExerciseSessionModal({ id: item.id })}
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
    const { sessions } = this.props.sessionStore!;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.sessionStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };

    return (
      <Card
        title={
          <div>
            <span>{L('Sessions')}</span>
            {/* {this.state.permisssionsGranted.create ? ( */}
            <Button
              type="primary"
              style={{ float: localization.getFloat() }}
              icon={<PlusOutlined />}
              onClick={() => this.openExerciseSessionModal({ id: 0 })}
            >
              {L('AddSession')}
            </Button>
          </div>
        }
      >
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
            <Button type="primary" onClick={async () => {}} style={{ width: 90 }}>
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ isActiveFilter: undefined }, async () => {});
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
          dataSource={sessions || []}
          columns={this.exerciseTableColumns}
          onChange={this.handleTableChange}
          loading={this.props.sessionStore!.loadingSessions}
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
                  <b>{`${L('SessionTime')} (${L('Minutes')})`}: </b>
                  {record.timeInMinutes}
                </span>
                <span>
                  <b>{`${L('AmountOfCalories')} (${L('kcal')})`}: </b>
                  {record.amountOfCalories}
                </span>
                <span>
                  <b>{L('SelectedExercises')} </b>
                  {record.exercises.map((exercise: ExerciseDto) => (
                    <Tag
                      style={{ width: 'fit-content', display: 'inline-block' }}
                      key={exercise.id}
                      color="purple"
                      className="ant-tag-disable-pointer"
                    >
                      {exercise.title}
                    </Tag>
                  ))}
                </span>

                <span>
                  <b>{L('ModifiedTime')}:</b>{' '}
                  {moment(record.lastModificationTime).format(timingHelper.defaultDateFormat)}
                </span>
                <span>
                  <b>{L('ModifiedBy')}:</b>{' '}
                  {record.modifiedBy ? record.modifiedBy : L('NotAvailable')}
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

        <ImageModel
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => {
            this.closeImageModal();
          }}
        />

        <CreateOrUpdateSession
          formRef={this.formRef}
          visible={this.state.exerciseSessionModalVisible}
          onCancel={() =>
            this.setState({
              exerciseSessionModalVisible: false,
            })
          }
          modalType={this.state.exerciseSessionModalType}
          onOk={this.createOrUpdateExerciseSession}
          isSubmittingExercise={this.props.sessionStore!.isSubmittingSession}
          sessionStore={this.props.sessionStore}
          exerciseStore={this.props.exerciseStore}
        />
        <SessionDetails
          data={this.state.sessionDetailsData}
          visible={this.state.sessionDetailsModalVisible}
          onCancel={() =>
            this.setState({ sessionDetailsModalVisible: false, sessionDetailsData: undefined })
          }
        />
      </Card>
    );
  }
}

export default ExerciseSession;
