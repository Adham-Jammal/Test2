/* eslint-disable */

import * as React from 'react';
import { Button, Card, Table, Tag, Select, Row, Col, Tooltip, Image } from 'antd';
import { inject, observer } from 'mobx-react';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import localization from '../../lib/localization';
import ImageModel from '../../components/ImageModal';
import {
  CheckSquareOutlined,
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  StopOutlined,
  UpOutlined,
  DownOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import userService from '../../services/user/userService';
import FilterationBox from '../../components/FilterationBox';
import SearchColumnBox from '../../components/SearchColumnBox';
import utils from '../../utils/utils';
import CreateOrUpdateExercise from './components/createOrUpdateExercise';
import { EntityDto } from '../../services/dto/entityDto';
import Stores from '../../stores/storeIdentifier';
import ExerciseStore from '../../stores/exerciseStore';
import { CreateExercisetDto } from '../../services/exercise/dto/createExerciseDto';
import { UpdateExercisetDto } from '../../services/exercise/dto/updateExerciseDto';
import { popupConfirm } from '../../lib/popupMessages';
import { ExerciseDto } from '../../services/exercise/dto/exerciseDto';
// import ParagWithSeeMore from '../../components/ParagWithSeeMore';
import ExcerciseDetails from './components/ExerciseDetails';
import moment from 'moment';
import timingHelper from '../../lib/timingHelper';
import VideoPreviewModal from '../Stories/components/VideoPreviewModal';

const filterationColLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 7 },
  xl: { span: 7 },
  xxl: { span: 7 },
};

export interface IExerciseProps {
  exerciseStore: ExerciseStore;
}

export interface IExerciseState {
  exerciseModalVisible: boolean;
  videoModalVisible: boolean;
  exerciseModalId: number;
  videoUrl: string;
  exerciseModalType: string;
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
  exerciseDetailsData?: ExerciseDto;
  exerciseDetailsModalVisible: boolean;
}

declare var abp: any;

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.ExerciseStore)
@observer
export class Exercise extends AppComponentBase<IExerciseProps, IExerciseState> {
  formRef = React.createRef<FormInstance>();

  currentUser: any = undefined;

  state = {
    exerciseModalVisible: false,
    exerciseModalId: 0,
    exerciseModalType: 'create',
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
    videoModalVisible: false,
    permisssionsGranted: {
      update: false,
      create: false,
      activation: false,
    },
    isActiveFilter: undefined,
    keyword: undefined,
    advancedSearchKeyword: '',
    searchedColumns: [],
    exerciseDetailsData: undefined,
    videoUrl: '',
    exerciseDetailsModalVisible: false,
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

    this.updateExercisesList(this.state.meta.pageSize, 0);
  }

  openExerciseDetailsModal = (data: ExerciseDto): void => {
    this.setState({
      exerciseDetailsModalVisible: true,
      exerciseDetailsData: data,
    });
  };
  // update exercise list based on different properties
  async updateExercisesList(maxResultCount: number, skipCount: number, sorting?: string) {
    this.props.exerciseStore!.maxResultCount = maxResultCount;
    this.props.exerciseStore!.skipCount = skipCount;
    this.props.exerciseStore!.statusFilter = this.state.isActiveFilter;
    this.props.exerciseStore!.keyword = this.state.keyword;
    this.props.exerciseStore!.advancedSearchKeyword = this.state.advancedSearchKeyword;
    this.props.exerciseStore!.sorting = sorting;
    await this.props.exerciseStore!.getAllExercises();
  }

  async openExerciseModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.exerciseStore!.exerciseModel = undefined;
      this.setState({ exerciseModalType: 'create' });
    } else {
      await this.props.exerciseStore!.getExercise(entityDto);
      this.setState({ exerciseModalType: 'edit' });
    }
    this.setState({
      exerciseModalVisible: !this.state.exerciseModalVisible,
      exerciseModalId: entityDto.id,
    });
  }

  openVideoModal = (videoUrl: string): void => {
    this.setState({ videoModalVisible: true, videoUrl });
  };
  createOrUpdateExercise = (url: string) => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.imageUrl = url;
      if (this.state.exerciseModalId === 0) {
        await this.props.exerciseStore!.createExercise(values as CreateExercisetDto);
      } else {
        values.id = this.state.exerciseModalId;
        await this.props.exerciseStore!.updateExercise(values as UpdateExercisetDto);
      }
      this.updateExercisesList(this.state.meta.pageSize, this.state.meta.skipCount);
      this.setState({ exerciseModalVisible: false });
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
      this.updateExercisesList(this.state.meta.pageSize, 0, `${sorter.columnKey} ASC`);
    } else if (sorter.order === 'descend') {
      this.updateExercisesList(this.state.meta.pageSize, 0, `${sorter.columnKey} DESC`);
    } else {
      this.updateExercisesList(this.state.meta.pageSize, 0);
    }
  };

  onSwitchNewsActivation = async (exercise: ExerciseDto) => {
    popupConfirm(
      async () => {
        if (exercise.isActive)
          await this.props.exerciseStore!.exerciseDeactivation({ id: exercise.id });
        else await this.props.exerciseStore!.exerciseActivation({ id: exercise.id });
        await this.updateExercisesList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      exercise.isActive
        ? L('AreYouSureYouWantToDeactivateThisExercise')
        : L('AreYouSureYouWantToActivateThisExercise')
    );
  };

  exerciseTableColumns = [
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
        () => this.updateExercisesList(this.state.meta.pageSize, 0),
        () => this.forceUpdate()
      ),
    },
    {
      title: L('Media'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string) => {
        return (
          <div className="video-preview" style={{ width: 'fit-content', display: 'inline-block' }}>
            {imageUrl.indexOf('.png') > -1 ||
            imageUrl.indexOf('.webp') > -1 ||
            imageUrl.indexOf('.jpeg') > -1 ||
            imageUrl.indexOf('.jpg') > -1 ? (
              <Image className="story-image" width={50} height={50} src={imageUrl} />
            ) : (
              <YoutubeOutlined
                style={{ fontSize: 40 }}
                onClick={() => this.openVideoModal(imageUrl)}
              />
            )}
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
      render: (text: string, item: ExerciseDto) => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon "
              onClick={() => this.openExerciseDetailsModal(item)}
            />
          </Tooltip>
          {this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon "
                onClick={() => this.openExerciseModal({ id: item.id })}
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
  handleCancelVideoModal = (): void => {
    this.setState({ videoModalVisible: false });
  };
  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      await this.updateExercisesList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateExercisesList(
        this.state.meta.pageSize,
        (page - 1) * this.state.meta.pageSize
      );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const { exercises } = this.props.exerciseStore!;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.exerciseStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Exercise')}</span>
            {this.state.permisssionsGranted.create ? (
              <Button
                type="primary"
                style={{ float: localization.getFloat() }}
                icon={<PlusOutlined />}
                onClick={() => this.openExerciseModal({ id: 0 })}
              >
                {L('AddExercise')}
              </Button>
            ) : null}
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
                    isActiveFilter: value === 3 ? undefined : value === 1 ? true : false,
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
                await this.updateExercisesList(this.state.meta.pageSize, this.state.meta.skipCount);
              }}
              style={{ width: 90 }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ isActiveFilter: undefined }, async () => {
                  await this.updateExercisesList(
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
          dataSource={exercises || []}
          columns={this.exerciseTableColumns}
          onChange={this.handleTableChange}
          loading={this.props.exerciseStore!.loadingExercises}
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
                  <b>{`${L('ExerciseDuration')} (${L('Minutes')})`}: </b>
                  {record.durationInMinutes}
                </span>
                <span>
                  <b>{`${L('AmountOfCalories')} (${L('kcal')})`}: </b>
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

        <ImageModel
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => {
            this.closeImageModal();
          }}
        />
        {this.state.exerciseModalVisible && (
          <CreateOrUpdateExercise
            formRef={this.formRef}
            visible={this.state.exerciseModalVisible}
            onCancel={() =>
              this.setState({
                exerciseModalVisible: false,
              })
            }
            modalType={this.state.exerciseModalType}
            onOk={this.createOrUpdateExercise}
            isSubmittingExercise={this.props.exerciseStore!.isSubmittingExercise}
            exerciseStore={this.props.exerciseStore}
          />
        )}
        <ExcerciseDetails
          data={this.state.exerciseDetailsData}
          visible={this.state.exerciseDetailsModalVisible}
          onCancel={() =>
            this.setState({ exerciseDetailsModalVisible: false, exerciseDetailsData: undefined })
          }
        />
        <VideoPreviewModal
          handleCancel={this.handleCancelVideoModal}
          videoUrl={this.state.videoUrl}
          visible={this.state.videoModalVisible}
        />
      </Card>
    );
  }
}

export default Exercise;
