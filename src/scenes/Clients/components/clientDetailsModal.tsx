/* eslint-disable */
import * as React from 'react';
import { Modal, Button, Tag, Avatar, Tabs, Collapse, Table, Image, Tooltip } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './clientDetailsModal.css';
import ClientStore from '../../../stores/clientStore';
import moment from 'moment';
import timingHelper from '../../../lib/timingHelper';
import {
  AppointmentRepeat,
  EventTypes,
  GenderType,
  LifeDreamStepStatus,
  ToDoPriority,
  UserStatus,
} from '../../../lib/types';
import ImageModal from '../../../components/ImageModal';
import EventDetailsModal from '../../Events/components/eventDetailsModal';
import {
  AddressDto,
  AnswerOutPutDto,
  AppointmentDto,
  DailySessionDto,
  HealthProfileAnswerDto,
  LifeDreamDto,
  LifeDreamStepDto,
  MomentDto,
  PositiveHabitDto,
  ToDoTaskDto,
} from '../../../services/clients/dto/clientDto';
import {
  BulbOutlined,
  ClockCircleOutlined,
  CoffeeOutlined,
  DownOutlined,
  EyeOutlined,
  FileExcelOutlined,
  HeartOutlined,
  InfoCircleOutlined,
  OrderedListOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  RetweetOutlined,
  ScheduleOutlined,
  SketchOutlined,
  UpOutlined,
} from '@ant-design/icons';
import ExcellentExport from 'excellentexport';
import { ChallengeDto, DishType, StepType } from '../../../services/challenges/dto';
import { EventDto } from '../../../services/events/dto/eventDto';
import { EntityDto } from '../../../services/dto/entityDto';
import AppointmentDetails from './appointmentDetailsModal';
import SessionDetails from './sessionDetailsModal';
import MomentDetails from './momentDetailsModal';

export interface IClientDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  clientStore: ClientStore;
  id: number;
}
enum IsActiveStatus {
  Inactive = 0,
  Active = 1,
  Closed = 2,
}
export interface IClientDetailsState {
  challengeMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  dreamsMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  habitsMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  toDoMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  appointmentsMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  dishesMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  sessionMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  sessionDetailsModalVisible: boolean;

  eventDetailsModalVisible: boolean;
  appointmentDetailsModalVisible: boolean;

  eventsMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  momentsMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  momentDetailsModalVisible: boolean;

  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
}
const INDEX_PAGE_SIZE_DEFAULT = 15;
const INDEX_PAGE_SIZE_OPTIONS = ['15', '30', '35', '50', '65'];

@inject(Stores.ClientStore)
@observer
class ClientDetailsModal extends React.Component<IClientDetailsModalProps, IClientDetailsState> {
  handleCancel = () => {
    this.props.onCancel();
  };
  state = {
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    challengeMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    momentDetailsModalVisible: false,
    dreamsMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    habitsMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    toDoMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    appointmentsMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    appointmentDetailsModalVisible: false,
    sessionDetailsModalVisible: false,
    sessionMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    eventDetailsModalVisible: false,

    momentsMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    dishesMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    eventsMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
  };

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }
  resolveStatus = (status: number) => {
    switch (status) {
      case UserStatus.Active:
        return (
          <Tag color={'green'} className="ant-tag-disable-pointer">
            {L('Active')}
          </Tag>
        );
      case UserStatus.Blocked:
        return (
          <Tag color={'red'} className="ant-tag-disable-pointer">
            {L('Blocked')}
          </Tag>
        );
      case UserStatus.Inactive:
        return (
          <Tag color={'volcano'} className="ant-tag-disable-pointer">
            {L('Inactive')}
          </Tag>
        );
    }
    return null;
  };
  async updateChallengeList(
    maxResultCount: number,
    skipCount: number,
    clientId?: number
  ): Promise<void> {
    await this.props.clientStore!.getChallenges({ clientId, maxResultCount, skipCount });
  }
  async updateMomentsList(
    maxResultCount: number,
    skipCount: number,
    clientId?: number
  ): Promise<void> {
    await this.props.clientStore!.getMoments({ clientId, maxResultCount, skipCount });
  }
  async updateSessionList(
    maxResultCount: number,
    skipCount: number,
    clientId?: number
  ): Promise<void> {
    await this.props.clientStore!.getSessions({ clientId, maxResultCount, skipCount });
  }

  async updateEventsList(
    maxResultCount: number,
    skipCount: number,
    clientId?: number
  ): Promise<void> {
    await this.props.clientStore!.getEvents({ clientId, maxResultCount, skipCount });
  }

  async updateDishesList(
    maxResultCount: number,
    skipCount: number,
    clientId?: number
  ): Promise<void> {
    await this.props.clientStore!.getDishes({ clientId, maxResultCount, skipCount });
  }

  async updateToDoList(
    maxResultCount: number,
    skipCount: number,
    clientId?: number
  ): Promise<void> {
    await this.props.clientStore!.getToDoList({ clientId, maxResultCount, skipCount });
  }

  async updateAppointmentsList(
    maxResultCount: number,
    skipCount: number,
    clientId?: number
  ): Promise<void> {
    await this.props.clientStore!.getAppointments({ clientId, maxResultCount, skipCount });
  }

  async updateHabitsList(
    maxResultCount: number,
    skipCount: number,
    clientId?: number
  ): Promise<void> {
    await this.props.clientStore!.getPositiveHabit({ clientId, maxResultCount, skipCount });
  }

  async updateDreamsList(
    maxResultCount: number,
    skipCount: number,
    clientId?: number
  ): Promise<void> {
    await this.props.clientStore!.getDreams({ clientId, maxResultCount, skipCount });
  }

  dreamsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Title'),
      dataIndex: 'title',
      key: 'title',
    },

    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string) => {
        return (
          <Image preview={!!imageUrl} width={50} height={50} src={imageUrl} alt={L('Image')} />
        );
      },
    },
    {
      title: L('CreationDate'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (creationTime: string) => {
        return moment(creationTime).format(timingHelper.defaultDateFormat);
      },
    },

    {
      title: L('IsAchieved'),
      dataIndex: 'isAchieved',
      key: 'isAchieved',
      render: (isAchieved: boolean) => {
        return (
          <Tag color={isAchieved ? 'success' : 'magenta'}>
            {isAchieved ? L('Achieved') : L('NotAchieved')}
          </Tag>
        );
      },
    },
  ];

  habitsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Title'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: L('Description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string) => {
        return (
          <Image preview={!!imageUrl} width={50} height={50} src={imageUrl} alt={L('Image')} />
        );
      },
    },
    {
      title: L('Date'),
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => {
        return moment(date).format(timingHelper.defaultDateFormat);
      },
    },
  ];

  toDoTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Title'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: L('Priority'),
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: ToDoPriority) => {
        return (
          <Tag color="blue">
            {priority === ToDoPriority.Important
              ? L('Important')
              : priority === ToDoPriority.VeryImportant
              ? L('VeryImportant')
              : L('Normal')}
          </Tag>
        );
      },
    },
    {
      title: L('Date'),
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => {
        return moment(date).format(timingHelper.defaultDateFormat);
      },
    },
    {
      title: L('Status'),
      dataIndex: 'isAchieved',
      key: 'isAchieved',
      render: (isAchieved: boolean): JSX.Element => (
        <>
          {isAchieved ? (
            <Tag color="green">{L('Achieved')}</Tag>
          ) : (
            <Tag color="red">{L('NotAchieved')}</Tag>
          )}
        </>
      ),
    },
  ];

  challengeTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Title'),
      dataIndex: 'title',
      key: 'title',
    },

    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (mainPicture: string): JSX.Element => (
        <Image
          preview={!!mainPicture}
          width={50}
          height={50}
          src={mainPicture}
          alt={L('ChallengeImage')}
        />
      ),
    },
    {
      title: L('CurrentStep'),
      dataIndex: 'currentStep',
      key: 'currentStep',
      render: (currentStep: StepType) => {
        return (
          <Tag color="blue">
            {currentStep === StepType.Joined
              ? L('Joined')
              : currentStep === StepType.NotJoined
              ? L('NotJoined')
              : currentStep === StepType.InviteFriends
              ? L('InviteFriends')
              : currentStep === StepType.VerifiedMoment
              ? L('VerifiedMoment')
              : L('ClaimRewards')}
          </Tag>
        );
      },
    },
    {
      title: L('ChallengeDate'),
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => {
        return moment(date).format(timingHelper.defaultDateFormat);
      },
    },
    {
      title: L('Status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: number): JSX.Element => (
        <>
          {isActive ? (
            <Tag color="green">{L('Active')}</Tag>
          ) : (
            <Tag color="red">{L('Inactive')}</Tag>
          )}
        </>
      ),
    },
  ];

  dishesTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Name'),
      dataIndex: 'dishName',
      key: 'dishName',
    },
    {
      title: L('Image'),
      dataIndex: 'dishImage',
      key: 'dishImage',
      render: (mainPicture: string): JSX.Element => (
        <Image
          preview={!!mainPicture}
          width={50}
          height={50}
          src={mainPicture}
          alt={L('ChallengeImage')}
        />
      ),
    },
    {
      title: L('RecipeName'),
      dataIndex: 'recipeName',
      key: 'recipeName',
    },
    {
      title: L('RecipeImage'),
      dataIndex: 'recipeImage',
      key: 'recipeImage',
      render: (mainPicture: string): JSX.Element => (
        <Image
          preview={!!mainPicture}
          width={50}
          height={50}
          src={mainPicture}
          alt={L('ChallengeImage')}
        />
      ),
    },
    {
      title: L('Type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: DishType) => {
        return (
          <Tag color="blue">
            {type === DishType.Dinner
              ? L('Dinner')
              : type === DishType.Launch
              ? L('Launch')
              : type === DishType.Snak
              ? L('Snak')
              : L('Breakfast')}
          </Tag>
        );
      },
    },
    {
      title: L('AmountOfCalories'),
      dataIndex: 'amountOfCalories',
      key: 'amountOfCalories',
    },
    {
      title: L('CreationDate'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (date: string) => {
        return moment(date).format(timingHelper.defaultDateFormat);
      },
    },
  ];

  challengePaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (_: number, pageSize: any) => {
      const temp = this.state;
      temp.challengeMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateChallengeList(pageSize, 0, this.props.id);
    },
    onChange: async (page: number) => {
      const temp = this.state;
      temp.challengeMeta.page = page;
      this.setState(temp);
      await this.updateChallengeList(
        this.state.challengeMeta.pageSize,
        (page - 1) * this.state.challengeMeta.pageSize,
        this.props.id
      );
    },
    pageSizeOptions: this.state.challengeMeta.pageSizeOptions,
    showTotal: (total: number, range: number[]) =>
      `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  momentPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (_: number, pageSize: any) => {
      const temp = this.state;
      temp.momentsMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateMomentsList(pageSize, 0, this.props.id);
    },
    onChange: async (page: number) => {
      const temp = this.state;
      temp.momentsMeta.page = page;
      this.setState(temp);
      await this.updateMomentsList(
        this.state.momentsMeta.pageSize,
        (page - 1) * this.state.momentsMeta.pageSize,
        this.props.id
      );
    },
    pageSizeOptions: this.state.momentsMeta.pageSizeOptions,
    showTotal: (total: number, range: number[]) =>
      `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  sessionsPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (_: number, pageSize: any) => {
      const temp = this.state;
      temp.sessionMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateSessionList(pageSize, 0, this.props.id);
    },
    onChange: async (page: number) => {
      const temp = this.state;
      temp.sessionMeta.page = page;
      this.setState(temp);
      await this.updateSessionList(
        this.state.sessionMeta.pageSize,
        (page - 1) * this.state.sessionMeta.pageSize,
        this.props.id
      );
    },
    pageSizeOptions: this.state.sessionMeta.pageSizeOptions,
    showTotal: (total: number, range: number[]) =>
      `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  dreamsPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (_: number, pageSize: any) => {
      const temp = this.state;
      temp.dreamsMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateDreamsList(pageSize, 0, this.props.id);
    },
    onChange: async (page: number) => {
      const temp = this.state;
      temp.dreamsMeta.page = page;
      this.setState(temp);
      await this.updateDreamsList(
        this.state.dreamsMeta.pageSize,
        (page - 1) * this.state.dreamsMeta.pageSize,
        this.props.id
      );
    },
    pageSizeOptions: this.state.dreamsMeta.pageSizeOptions,
    showTotal: (total: number, range: number[]) =>
      `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  eventPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (_: number, pageSize: any) => {
      const temp = this.state;
      temp.eventsMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateEventsList(pageSize, 0, this.props.id);
    },
    onChange: async (page: number) => {
      const temp = this.state;
      temp.eventsMeta.page = page;
      this.setState(temp);
      await this.updateEventsList(
        this.state.eventsMeta.pageSize,
        (page - 1) * this.state.eventsMeta.pageSize,
        this.props.id
      );
    },
    pageSizeOptions: this.state.eventsMeta.pageSizeOptions,
    showTotal: (total: number, range: number[]) =>
      `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  habitsPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (_: number, pageSize: any) => {
      const temp = this.state;
      temp.habitsMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateHabitsList(pageSize, 0, this.props.id);
    },
    onChange: async (page: number) => {
      const temp = this.state;
      temp.habitsMeta.page = page;
      this.setState(temp);
      await this.updateHabitsList(
        this.state.habitsMeta.pageSize,
        (page - 1) * this.state.habitsMeta.pageSize,
        this.props.id
      );
    },
    pageSizeOptions: this.state.habitsMeta.pageSizeOptions,
    showTotal: (total: number, range: number[]) =>
      `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  toDoPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (_: number, pageSize: any) => {
      const temp = this.state;
      temp.toDoMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateToDoList(pageSize, 0, this.props.id);
    },
    onChange: async (page: number) => {
      const temp = this.state;
      temp.toDoMeta.page = page;
      this.setState(temp);
      await this.updateToDoList(
        this.state.toDoMeta.pageSize,
        (page - 1) * this.state.toDoMeta.pageSize,
        this.props.id
      );
    },
    pageSizeOptions: this.state.toDoMeta.pageSizeOptions,
    showTotal: (total: number, range: number[]) =>
      `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  dishesPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (_: number, pageSize: any) => {
      const temp = this.state;
      temp.dishesMeta.pageSize = pageSize;
      this.setState(temp);
      this.updateDishesList(pageSize, 0, this.props.id);
    },
    onChange: async (page: number) => {
      const temp = this.state;
      temp.dishesMeta.page = page;
      this.setState(temp);
      await this.updateDishesList(
        this.state.dishesMeta.pageSize,
        (page - 1) * this.state.dishesMeta.pageSize,
        this.props.id
      );
    },
    pageSizeOptions: this.state.dishesMeta.pageSizeOptions,
    showTotal: (total: number, range: number[]) =>
      `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  eventStatus = {
    0: {
      value: IsActiveStatus.Inactive,
      text: L('Inactive'),
      color: 'red',
    },
    1: {
      value: IsActiveStatus.Active,
      text: L('Active'),
      color: 'green',
    },
  };
  eventsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Title'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: L('EventMainPicture'),
      dataIndex: 'mainPicture',
      key: 'mainPicture',
      render: (mainPicture: string) => {
        return (
          <Image
            preview={!!mainPicture}
            width={50}
            height={50}
            src={mainPicture}
            alt={L('OrganizerImage')}
          />
        );
      },
    },

    {
      title: L('eventTime'),
      dataIndex: 'fromDate',
      key: 'fromDate',
      render: (fromDate: Date, item: EventDto): string =>
        `${moment(item.startDate).format(timingHelper.defaultDateFormat)} ${L('To')} ${moment(
          item.endDate
        ).format(timingHelper.defaultTimeFormat)} `,
    },
    {
      title: L('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: number): JSX.Element => (
        <>
          {this.eventStatus[String(status)] && (
            <Tag color={this.eventStatus[String(status)].color} className="ant-tag-disable-pointer">
              {this.eventStatus[String(status)].text}
            </Tag>
          )}
        </>
      ),
    },
    {
      title: L('Action'),
      key: 'action',
      render: (_: string, item: EventDto): JSX.Element => {
        return (
          <div>
            <Tooltip title={L('Details')}>
              <EyeOutlined
                className="action-icon"
                onClick={() => this.openEventDetailsModal({ id: item.id! })}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  async openMomentDetailsModal(entity: EntityDto) {
    await this.props.clientStore!.getMoment(entity);
    this.setState({
      momentDetailsModalVisible: !this.state.momentDetailsModalVisible,
    });
  }

  async openEventDetailsModal(entity: EntityDto) {
    await this.props.clientStore!.getEvent(entity);
    this.setState({
      eventDetailsModalVisible: !this.state.eventDetailsModalVisible,
    });
  }
  async openAppointmentsDetailsModal(entity: EntityDto) {
    this.props.clientStore!.getAppointment(entity);
    this.setState({
      appointmentDetailsModalVisible: !this.state.appointmentDetailsModalVisible,
    });
  }

  async openSessionDetailsModal(entity: EntityDto) {
    this.props.clientStore!.getSession(entity);
    this.setState({
      sessionDetailsModalVisible: !this.state.sessionDetailsModalVisible,
    });
  }
  appointmentTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Title'),
      dataIndex: 'title',
      key: 'title',
    },

    {
      title: L('Date'),
      dataIndex: 'startDate',
      key: 'startDate',
      render: (_: any, item: AppointmentDto): string =>
        `${moment(item.startDate).format(timingHelper.defaultDateFormat)} ${L('To')} ${moment(
          item.endDate
        ).format(timingHelper.defaultDateFormat)} `,
    },
    {
      title: L('Time'),
      dataIndex: 'fromHour',
      key: 'fromHour',
      render: (_: any, item: AppointmentDto): string =>
        `${moment(item.fromHour).format(timingHelper.defaultTimeFormat)} ${L('To')} ${moment(
          item.toHour
        ).format(timingHelper.defaultTimeFormat)} `,
    },
    {
      title: L('IsDone'),
      dataIndex: 'isDone',
      key: 'isDone',
      render: (isDone: boolean): JSX.Element => (
        <Tag color={isDone ? 'green' : 'magenta'} className="ant-tag-disable-pointer">
          {isDone ? L('Complete') : L('InComplete')}
        </Tag>
      ),
    },
    {
      title: L('Action'),
      key: 'action',
      render: (_: string, item: AppointmentDto): JSX.Element => {
        return (
          <div>
            <Tooltip title={L('Details')}>
              <EyeOutlined
                className="action-icon"
                onClick={() => this.openAppointmentsDetailsModal({ id: item.id! })}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];
  sessionsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Title'),
      dataIndex: 'title',
      key: 'title',
    },

    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (_: any, item: DailySessionDto) => (
        <Image
          preview={!!item.session!.imageUrl}
          width={50}
          height={50}
          src={item.session!.imageUrl}
          alt={L('Image')}
        />
      ),
    },
    {
      title: L('SessionTime'),
      dataIndex: 'timeInMinutes',
      key: 'timeInMinutes',
      render: (_: any, item: DailySessionDto): number => item.session.timeInMinutes,
    },
    {
      title: L('CreationDate'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (_: any, item: DailySessionDto): string =>
        `${moment(item.creationTime).format(timingHelper.defaultDateFormat)}`,
    },
    {
      title: L('Action'),
      key: 'action',
      render: (_: string, item: DailySessionDto): JSX.Element => {
        return (
          <div>
            <Tooltip title={L('Details')}>
              <EyeOutlined
                className="action-icon"
                onClick={() => this.openSessionDetailsModal({ id: item.id! })}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  momentsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },

    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (mainPicture: string) => {
        return (
          <Image
            preview={!!mainPicture}
            width={50}
            height={50}
            src={mainPicture}
            alt={L('Image')}
          />
        );
      },
    },
    {
      title: L('CommentsCount'),
      dataIndex: 'commentsCount',
      key: 'commentsCount',
    },
    {
      title: L('InteractionsCount'),
      dataIndex: 'interactionsCount',
      key: 'interactionsCount',
    },

    {
      title: L('CreationDate'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (creationTime: string): string =>
        `${moment(creationTime).format(timingHelper.defaultDateFormat)}`,
    },

    {
      title: L('Action'),
      key: 'action',
      render: (_: string, item: MomentDto): JSX.Element => {
        return (
          <div>
            <Tooltip title={L('Details')}>
              <EyeOutlined
                className="action-icon"
                onClick={() => this.openMomentDetailsModal({ id: item.id! })}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];
  render() {
    const { visible } = this.props;
    const { clientModel } = this.props.clientStore!;
    const challengePagination = {
      ...this.challengePaginationOptions,
      total: this.props.clientStore?.challengesTotalCount,
      current: this.state.challengeMeta.page,
      pageSize: this.state.challengeMeta.pageSize,
    };
    const sessionPagination = {
      ...this.sessionsPaginationOptions,
      total: this.props.clientStore?.sessionsTotalCount,
      current: this.state.sessionMeta.page,
      pageSize: this.state.sessionMeta.pageSize,
    };
    const momentPagination = {
      ...this.momentPaginationOptions,
      total: this.props.clientStore?.momentsTotalCount,
      current: this.state.momentsMeta.page,
      pageSize: this.state.momentsMeta.pageSize,
    };
    const dishesPagination = {
      ...this.dishesPaginationOptions,
      total: this.props.clientStore?.dishesTotalCount,
      current: this.state.dishesMeta.page,
      pageSize: this.state.dishesMeta.pageSize,
    };
    const habitsPagination = {
      ...this.habitsPaginationOptions,
      total: this.props.clientStore?.habitsTotalCount,
      current: this.state.habitsMeta.page,
      pageSize: this.state.habitsMeta.pageSize,
    };
    const eventPagination = {
      ...this.eventPaginationOptions,
      total: this.props.clientStore?.eventsTotalCount,
      current: this.state.eventsMeta.page,
      pageSize: this.state.eventsMeta.pageSize,
    };
    const toDoPagination = {
      ...this.toDoPaginationOptions,
      total: this.props.clientStore?.toDoListTotalCount,
      current: this.state.toDoMeta.page,
      pageSize: this.state.toDoMeta.pageSize,
    };
    const appointmentPagination = {
      ...this.appointmentTableColumns,
      total: this.props.clientStore?.appointmentTotalCount,
      current: this.state.appointmentsMeta.page,
      pageSize: this.state.appointmentsMeta.pageSize,
    };
    const dreamsPagination = {
      ...this.dreamsTableColumns,
      total: this.props.clientStore?.dreamsTotalCount,
      current: this.state.dreamsMeta.page,
      pageSize: this.state.dreamsMeta.pageSize,
    };

    return (
      <Modal
        visible={visible}
        title={L('Details')}
        onCancel={this.handleCancel}
        centered
        maskClosable={false}
        destroyOnClose
        width="95%"
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <a
            download={`client-${clientModel?.id}.xlsx`}
            className="ant-btn ant-btn-default export-btn"
            style={{ float: localization.isRTL() ? 'right' : 'left' }}
            id="export2"
            href="#"
            onClick={() => {
              return ExcellentExport.convert(
                {
                  anchor: document.getElementById('export2') as HTMLAnchorElement,
                  filename: L('Client'),
                  format: 'xlsx',
                },
                [
                  {
                    name: L('Client'),
                    from: { table: document.getElementById('datatable2') as HTMLTableElement },
                  },
                ]
              );
            }}
          >
            <FileExcelOutlined /> {L('ExportClientData')}
          </a>,
          <Button key="back" onClick={this.handleCancel}>
            {L('Close')}
          </Button>,
        ]}
      >
        <div className="scrollable-modal">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane
              tab={
                <span>
                  <InfoCircleOutlined />
                  {L('General')}
                </span>
              }
              key="1"
            >
              <div className="details-wrapper">
                <div className="detail-wrapper">
                  <span className="detail-label">{L('ID')}</span>
                  <span className="detail-value">
                    {clientModel !== undefined ? clientModel.id : undefined}
                  </span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('Name')}</span>
                  <span className="detail-value">
                    {clientModel !== undefined ? clientModel.fullName : undefined}
                  </span>
                </div>{' '}
                <div className="detail-wrapper">
                  <span className="detail-label">{L('UserName')}</span>
                  <span className="detail-value">
                    {clientModel !== undefined ? clientModel.userName : undefined}
                  </span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('Email')}</span>
                  <span className="detail-value">
                    {clientModel !== undefined ? clientModel.emailAddress : undefined}
                  </span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('PhoneNumber')}</span>
                  <span className="detail-value">
                    {clientModel !== undefined
                      ? clientModel.countryCode + '' + clientModel.phoneNumber
                      : undefined}
                  </span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('City')}</span>
                  <span className="detail-value">
                    {clientModel !== undefined && clientModel.city
                      ? clientModel.city?.text
                      : L('NotAvailable')}
                  </span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('Image')}</span>
                  <span className="detail-value">
                    {clientModel !== undefined ? (
                      <div
                        onClick={() =>
                          this.openImageModal(clientModel.imageUrl!, clientModel.fullName!)
                        }
                        style={{ display: 'inline-block', cursor: 'zoom-in' }}
                      >
                        <Avatar shape="square" size={50} src={clientModel.imageUrl!} />
                      </div>
                    ) : undefined}
                  </span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('Gender')}</span>
                  <span className="detail-value">
                    {clientModel !== undefined && clientModel.gender !== undefined ? (
                      <Tag color={'blue'} className="ant-tag-disable-pointer">
                        {clientModel.gender === GenderType.Female
                          ? L('Female')
                          : clientModel.gender === GenderType.Male
                          ? L('Male')
                          : L('Other')}
                      </Tag>
                    ) : undefined}
                  </span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('HasAvatar')}</span>
                  <span className="detail-value">
                    {clientModel !== undefined && clientModel.hasAvatar !== undefined ? (
                      <Tag
                        color={clientModel.hasAvatar ? 'green' : 'magenta'}
                        className="ant-tag-disable-pointer"
                      >
                        {clientModel.hasAvatar ? L('Yes') : L('No')}
                      </Tag>
                    ) : (
                      L('NotAvailable')
                    )}
                  </span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('PaymentsCount')}</span>
                  <span className="detail-value">
                    {clientModel !== undefined ? clientModel.paymentsCount : undefined}
                  </span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('Addresses')}</span>
                  <span className="detail-value">
                    {clientModel !== undefined &&
                    clientModel.addresses &&
                    clientModel.addresses.length > 0
                      ? clientModel.addresses.map((address: AddressDto) => (
                          <Tag className="ant-tag-disable-pointer" color={'default'}>
                            {address.city.text + ', ' + address.street}
                          </Tag>
                        ))
                      : L('NotAvailable')}
                  </span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('birthDate')}</span>
                  <span className="detail-value">
                    {clientModel !== undefined
                      ? moment(clientModel.birthDate).format(timingHelper.defaultDateFormat)
                      : L('NotAvailable')}
                  </span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('Status')}</span>
                  <span className="detail-value">
                    {clientModel !== undefined && clientModel.status !== undefined
                      ? this.resolveStatus(clientModel.status)
                      : undefined}
                  </span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('CreationDate')}</span>
                  <span className="detail-value">
                    {clientModel !== undefined
                      ? moment(clientModel.creationTime).format(timingHelper.defaultDateFormat)
                      : undefined}
                  </span>
                </div>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span>
                  <QuestionCircleOutlined />
                  {L('Questions')}
                </span>
              }
              key="2"
            >
              <h3>{L('HealthProfileQuestions')}</h3>
              {this.props.clientStore.healthQuestions &&
              this.props.clientStore.healthQuestions.length > 0 ? (
                <Collapse accordion>
                  {this.props.clientStore.healthQuestions.map(
                    (item: HealthProfileAnswerDto, index: number) => {
                      return (
                        <Collapse.Panel header={item.question} key={index}>
                          <p>{item.answer}</p>
                        </Collapse.Panel>
                      );
                    }
                  )}
                </Collapse>
              ) : (
                <p>{L('NotAvailable')}</p>
              )}

              <br />
              <br />
              <h3>{L('PersonalityQuestions2')}</h3>
              {this.props.clientStore.personalityQuestions &&
              this.props.clientStore.personalityQuestions.length > 0 ? (
                <Collapse accordion>
                  {this.props.clientStore.personalityQuestions.map(
                    (item: AnswerOutPutDto, index: number) => {
                      return (
                        <Collapse.Panel header={item.question} key={index}>
                          <p>{item.choice}</p>
                        </Collapse.Panel>
                      );
                    }
                  )}
                </Collapse>
              ) : (
                <p>{L('NotAvailable')}</p>
              )}
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span>
                  <BulbOutlined />
                  {L('Challenges')}
                </span>
              }
              key="3"
            >
              <Table
                className="challenge-table"
                pagination={challengePagination}
                rowKey={(record) => `${record.id}`}
                loading={this.props.clientStore.loadingChallenges}
                dataSource={this.props.clientStore.challenges || []}
                columns={this.challengeTableColumns}
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
                        <b>{L('Points')}: </b>
                        {record.points}
                      </span>
                      <span>
                        <b>{L('MinNumOfInvitee')}: </b>
                        {record.minNumOfInvitee}
                      </span>
                      <span>
                        <b>{L('IsExpired')}: </b>
                        {record.isExpired ? (
                          <Tag
                            style={{ width: 'fit-content', display: 'inline-block' }}
                            color="red"
                          >
                            {L('Expired')}
                          </Tag>
                        ) : (
                          <Tag
                            style={{ width: 'fit-content', display: 'inline-block' }}
                            color="green"
                          >
                            {L('UnExpired')}
                          </Tag>
                        )}
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
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span>
                  <ScheduleOutlined /> {L('Events')}
                </span>
              }
              key="4"
            >
              <Table
                className="event-table"
                pagination={eventPagination}
                rowKey={(record) => `${record.id}`}
                loading={this.props.clientStore?.loadingEvents}
                dataSource={this.props.clientStore.events || []}
                columns={this.eventsTableColumns}
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
                        <b> {L('Category')}: </b>
                        {record.categoryName}
                      </span>

                      <span>
                        <b>{L('OrganizerName')}: </b>
                        {record.organizer
                          ? record.organizer!.name + ' ' + record.organizer!.surname
                          : ''}
                      </span>

                      <span>
                        <b>{L('OrganizerImage')}:</b>
                        <Image
                          preview={!!record.organizer!.imageUrl}
                          width={50}
                          height={50}
                          src={record.organizer!.imageUrl}
                          alt={L('OrganizerImage')}
                        />
                      </span>

                      <span>
                        <b>{L('TicketPrice')}:</b> {record.price}
                      </span>

                      <span>
                        <b>{L('SubscribersCount')}: </b>
                        {record.bookedSeats}
                      </span>
                      <span>
                        <b> {L('CreationDate')}: </b>
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
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span>
                  <PlayCircleOutlined />
                  {L('Moments')}
                </span>
              }
              key="5"
            >
              <Table
                className="event-table"
                pagination={momentPagination}
                rowKey={(record) => `${record.id}`}
                loading={this.props.clientStore?.loadingMoments}
                dataSource={this.props.clientStore.moments || []}
                columns={this.momentsTableColumns}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span>
                  <HeartOutlined /> {L('Sessions')}
                </span>
              }
              key="6"
            >
              <Table
                className="event-table"
                pagination={sessionPagination}
                rowKey={(record) => `${record.id}`}
                loading={this.props.clientStore?.loadingSessions}
                dataSource={this.props.clientStore.sessions || []}
                columns={this.sessionsTableColumns}
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
                        <b> {L('TrainingKcal')}: </b>
                        {record.trainingKcal}
                      </span>
                      <span>
                        <b>{L('WalkingKcal')}:</b> {record.walkingKcal}
                      </span>
                      <span>
                        <b>{L('AmountOfCalories')}: </b>
                        {record.session.amountOfCalories}
                      </span>
                    </p>
                  ),
                  rowExpandable: (record) => true,
                }}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span>
                  <CoffeeOutlined /> {L('Dishes')}
                </span>
              }
              key="7"
            >
              <Table
                pagination={dishesPagination}
                rowKey={(record) => `${record.id}`}
                loading={this.props.clientStore?.loadingDishes}
                dataSource={this.props.clientStore.dishes || []}
                columns={this.dishesTableColumns}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span>
                  <OrderedListOutlined /> {L('ToDoList')}
                </span>
              }
              key="8"
            >
              <Table
                pagination={toDoPagination}
                rowKey={(record) => `${record.id}`}
                loading={this.props.clientStore?.loadingToDoList}
                dataSource={this.props.clientStore.toDoList || []}
                columns={this.toDoTableColumns}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span>
                  <ClockCircleOutlined /> {L('Appointments')}
                </span>
              }
              key="9"
            >
              <Table
                pagination={appointmentPagination}
                rowKey={(record) => `${record.id}`}
                loading={this.props.clientStore?.loadingAppointments}
                dataSource={this.props.clientStore.appointments || []}
                columns={this.appointmentTableColumns}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span>
                  <RetweetOutlined /> {L('Habits')}
                </span>
              }
              key="10"
            >
              <Table
                pagination={habitsPagination}
                rowKey={(record) => `${record.id}`}
                loading={this.props.clientStore?.loadingHabits}
                dataSource={this.props.clientStore.habits || []}
                columns={this.habitsTableColumns}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span>
                  <SketchOutlined /> {L('Dreams')}
                </span>
              }
              key="11"
            >
              <Table
                className="challenge-table"
                pagination={dreamsPagination}
                rowKey={(record) => `${record.id}`}
                loading={this.props.clientStore.loadingDreams}
                dataSource={this.props.clientStore.dreams || []}
                columns={this.dreamsTableColumns}
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
                        <b>{L('TotalStepsCount')}: </b>
                        {record.totalStepsCount}
                      </span>
                      <span>
                        <b>{L('AchievedStepsCount')}: </b>
                        {record.achievedStepsCount}
                      </span>
                      <span>
                        <b>{L('PendingStepsCount')}: </b>
                        {record.pendingStepsCount}
                      </span>
                      <span>
                        <b>{L('Steps')}: </b>
                        {record.steps &&
                          record.steps.map((item: LifeDreamStepDto) => {
                            return (
                              <p key={item.id}>
                                {item.title +
                                  ', ' +
                                  item.order +
                                  ', ' +
                                  (item.status === LifeDreamStepStatus.NotAchieved
                                    ? L('NotAchieved')
                                    : L('Achieved'))}
                              </p>
                            );
                          })}
                      </span>
                    </p>
                  ),
                  rowExpandable: (record) => true,
                }}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <table id="datatable2" style={{ display: 'none' }}>
          <thead>
            <tr>
              <td>{L('ID')}</td>
              <td>{L('Name')}</td>
              <td>{L('Code')}</td>
              <td>{L('UserName')}</td>
              <td>{L('Email')}</td>
              <td>{L('PhoneNumber')}</td>
              <td>{L('Gender')}</td>
              <td>{L('HasAvatar')}</td>
              <td>{L('City')}</td>
              <td>{L('Addresses')}</td>
              <td>{L('BirthDate')}</td>
              <td>{L('PaymentsCount')}</td>
              <td>{L('LastLoginTime')}</td>
              <td>{L('Status')}</td>
              <td>{L('CreationDate')}</td>
              <td>{L('PersonalityQuestions2')}</td>
              <td>{L('HealthProfileQuestions')}</td>
              <td>{L('Challenges')}</td>
              <td>{L('Events')}</td>
              <td>{L('Moments')}</td>
              <td>{L('Sessions')}</td>
              <td>{L('Dishes')}</td>
              <td>{L('ToDoList')}</td>
              <td>{L('Appointments')}</td>
              <td>{L('Habits')}</td>
              <td>{L('Dreams')}</td>
            </tr>
          </thead>
          <tbody>
            {clientModel && (
              <tr>
                <td>{clientModel.id}</td>
                <td>{clientModel.fullName}</td>
                <td>{clientModel.code}</td>
                <td>{clientModel.userName}</td>
                <td>{clientModel.emailAddress}</td>
                <td>{clientModel.countryCode + '' + clientModel.phoneNumber}</td>
                <td>
                  {clientModel.gender === GenderType.Female
                    ? L('Female')
                    : clientModel.gender === GenderType.Male
                    ? L('Male')
                    : L('Other')}
                </td>
                <td>{clientModel.hasAvatar ? L('Yes') : L('No')}</td>
                <td>{clientModel.city ? clientModel.city.text : L('NotAvailable')}</td>
                <td>
                  {clientModel.addresses && clientModel.addresses.length > 0
                    ? clientModel.addresses.map(
                        (address: AddressDto) => address.city.text + ', ' + address.street + ' - '
                      )
                    : L('NotAvailable')}
                </td>
                <td>{moment(clientModel.birthDate).format(timingHelper.defaultDateFormat)}</td>
                <td>{clientModel.paymentsCount}</td>
                <td>
                  {clientModel.lastLoginTime
                    ? moment(clientModel.lastLoginTime).format(timingHelper.defaultDateTimeFormat)
                    : L('NotAvailable')}
                </td>
                <td>
                  {clientModel.status === UserStatus.Inactive
                    ? L('Inactive')
                    : clientModel.status === UserStatus.Active
                    ? L('Active')
                    : L('Blocked')}
                </td>
                <td>{moment(clientModel.creationTime).format(timingHelper.defaultDateFormat)}</td>
                <td>
                  {this.props.clientStore.personalityQuestions &&
                  this.props.clientStore.personalityQuestions.length > 0 ? (
                    <>
                      {this.props.clientStore.personalityQuestions.map(
                        (item: AnswerOutPutDto, index: number) => {
                          return `${index + 1}.${item.question}: ${item.choice}.\n`;
                        }
                      )}
                    </>
                  ) : (
                    L('NotAvailable')
                  )}
                </td>
                <td>
                  {this.props.clientStore.healthQuestions &&
                  this.props.clientStore.healthQuestions.length > 0 ? (
                    <>
                      {this.props.clientStore.healthQuestions.map(
                        (item: HealthProfileAnswerDto, index: number) => {
                          return `${index + 1}.${item.question}: ${item.answer}.\n`;
                        }
                      )}
                    </>
                  ) : (
                    L('NotAvailable')
                  )}
                </td>
                <td>
                  {this.props.clientStore.challenges &&
                  this.props.clientStore.challenges.length > 0 ? (
                    <>
                      {this.props.clientStore.challenges.map(
                        (item: ChallengeDto, index: number) => {
                          return `${index + 1}.${L('Title')}:${item.title}, ${L('Points')}:${
                            item.points
                          }, ${L('CurrentStep')}:${
                            item.currentStep === StepType.Joined
                              ? L('Joined')
                              : item.currentStep === StepType.NotJoined
                              ? L('NotJoined')
                              : item.currentStep === StepType.InviteFriends
                              ? L('InviteFriends')
                              : item.currentStep === StepType.VerifiedMoment
                              ? L('VerifiedMoment')
                              : L('ClaimRewards')
                          }.\n`;
                        }
                      )}
                    </>
                  ) : (
                    L('NotAvailable')
                  )}
                </td>
                <td>
                  {' '}
                  {this.props.clientStore.events && this.props.clientStore.events.length > 0 ? (
                    <>
                      {this.props.clientStore.events.map((item: EventDto, index: number) => {
                        return `${index + 1}.${L('Title')}:${item.title}, ${L('Date')}:${moment(
                          item.startDate
                        ).format(timingHelper.defaultDateFormat)} ${L('To')} ${moment(
                          item.endDate
                        ).format(timingHelper.defaultDateFormat)}, ${L('Time')}:${moment(
                          item.fromHour
                        ).format(timingHelper.defaultTimeFormat)} ${L('To')} ${moment(
                          item.toHour
                        ).format(timingHelper.defaultTimeFormat)}, ${L('Category')}:${
                          item.categoryName
                        }, ${L('City')}:${item.cityName}, ${L('Type')}:${
                          item.eventType === EventTypes.Free
                            ? L('Free')
                            : item.eventType === EventTypes.PayWithEnterance
                            ? L('PayWithEnterance')
                            : item.eventType === EventTypes.PayWithSeats
                            ? L('PayWithSeats')
                            : item.eventType === EventTypes.Private
                            ? L('Private')
                            : L('Online')
                        }.\n`;
                      })}
                    </>
                  ) : (
                    L('NotAvailable')
                  )}
                </td>
                <td>{L('Moments')}</td>
                <td>
                  {this.props.clientStore.sessions && this.props.clientStore.sessions.length > 0 ? (
                    <>
                      {this.props.clientStore.sessions.map(
                        (item: DailySessionDto, index: number) => {
                          return `${index + 1}.${L('Title')}:${item.session?.title}, ${L(
                            'Date'
                          )}:${moment(item.creationTime).format(
                            timingHelper.defaultDateFormat
                          )}}, ${L('TrainingKcal')}:${item.trainingKcal}, ${L('WalkingKcal')}:${
                            item.walkingKcal
                          }, ${L('SessionTime')}:${item.session?.timeInMinutes}, ${L(
                            'AmountOfCalories'
                          )}:${item.session?.amountOfCalories}.\n`;
                        }
                      )}
                    </>
                  ) : (
                    L('NotAvailable')
                  )}
                </td>
                <td>
                  {this.props.clientStore.dishes && this.props.clientStore.dishes.length > 0 ? (
                    <>
                      {this.props.clientStore.dishes.map((item: any, index: number) => {
                        return `${index + 1}.${L('DishName')}:${item.dishName}, ${L(
                          'RecipeName'
                        )}:${item.recipeName}, ${L('Date')}:${moment(item.creationTime).format(
                          timingHelper.defaultDateFormat
                        )}, ${L('AmountOfCalories')}:${item.amountOfCalories}, ${L('Type')}:${
                          item.type === DishType.Breakfast
                            ? L('Breakfast')
                            : item.type === DishType.Launch
                            ? L('Launch')
                            : item.type === DishType.Snak
                            ? L('Snak')
                            : L('Dinner')
                        }.\n`;
                      })}
                    </>
                  ) : (
                    L('NotAvailable')
                  )}
                </td>
                <td>
                  {this.props.clientStore.toDoList && this.props.clientStore.toDoList.length > 0 ? (
                    <>
                      {this.props.clientStore.toDoList.map((item: ToDoTaskDto, index: number) => {
                        return `${index + 1}.${L('Title')}:${item.title}, ${L('Date')}:${moment(
                          item.date
                        ).format(timingHelper.defaultDateFormat)}, ${L('Priority')}:${
                          item.priority === ToDoPriority.Important
                            ? L('Important')
                            : item.priority === ToDoPriority.VeryImportant
                            ? L('VeryImportant')
                            : L('Normal')
                        }, ${L('IsAchieved')}:${
                          item.isAchieved ? L('Achieved') : L('NotAchieved')
                        }.\n`;
                      })}
                    </>
                  ) : (
                    L('NotAvailable')
                  )}
                </td>
                <td>
                  {this.props.clientStore.appointments &&
                  this.props.clientStore.appointments.length > 0 ? (
                    <>
                      {this.props.clientStore.appointments.map(
                        (item: AppointmentDto, index: number) => {
                          return `${index + 1}.${L('Title')}:${item.title}, ${L('Date')}:${moment(
                            item.startDate
                          ).format(timingHelper.defaultDateFormat)} ${L('To')} ${moment(
                            item.endDate
                          ).format(timingHelper.defaultDateFormat)}, ${L('Time')}:${moment(
                            item.fromHour
                          ).format(timingHelper.defaultTimeFormat)} ${L('To')} ${moment(
                            item.toHour
                          ).format(timingHelper.defaultTimeFormat)}, ${L('Priority')}:${
                            item.priority === ToDoPriority.Important
                              ? L('Important')
                              : item.priority === ToDoPriority.VeryImportant
                              ? L('VeryImportant')
                              : L('Normal')
                          }, ${L('Repeat')}:${
                            item.repeat === AppointmentRepeat.Daily
                              ? L('Daily')
                              : item.repeat === AppointmentRepeat.None
                              ? L('None')
                              : item.repeat === AppointmentRepeat.Weekly
                              ? L('Weekly')
                              : L('EveryMonth')
                          }, ${L('IsDone')}:${item.isDone ? L('Complete') : L('InComplete')}.\n`;
                        }
                      )}
                    </>
                  ) : (
                    L('NotAvailable')
                  )}
                </td>
                <td>
                  {this.props.clientStore.habits && this.props.clientStore.habits.length > 0 ? (
                    <>
                      {this.props.clientStore.habits.map(
                        (item: PositiveHabitDto, index: number) => {
                          return `${index + 1}.${L('Title')}:${item.title}, ${L('Description')}:${
                            item.description
                          }, ${L('TotalStepsCount')}:${moment(item.date).format(
                            timingHelper.defaultDateFormat
                          )}.\n`;
                        }
                      )}
                    </>
                  ) : (
                    L('NotAvailable')
                  )}
                </td>
                <td>
                  {this.props.clientStore.dreams && this.props.clientStore.dreams.length > 0 ? (
                    <>
                      {this.props.clientStore.dreams.map((item: LifeDreamDto, index: number) => {
                        return `${index + 1}.${L('Title')}:${item.title}, ${L('Date')}:${moment(
                          item.creationTime
                        ).format(timingHelper.defaultDateFormat)}, ${L('TotalStepsCount')}:${
                          item.totalStepsCount
                        }, ${L('AchievedStepsCount')}:${item.achievedStepsCount}, ${L(
                          'PendingStepsCount'
                        )}:${item.pendingStepsCount}, ${L('IsAchieved')}:${
                          item.isAchieved ? L('Achieved') : L('NotAchieved')
                        }.\n`;
                      })}
                    </>
                  ) : (
                    L('NotAvailable')
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <ImageModal
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => {
            this.closeImageModal();
          }}
        />
        <EventDetailsModal
          visible={this.state.eventDetailsModalVisible}
          onCancel={() => {
            this.setState({
              eventDetailsModalVisible: false,
            });
            this.props.clientStore!.eventModel = undefined;
          }}
          loading={this.props.clientStore?.isGettingEventData}
          eventData={this.props.clientStore?.eventModel}
        />
        <AppointmentDetails
          visible={this.state.appointmentDetailsModalVisible}
          onCancel={() => {
            this.setState({
              appointmentDetailsModalVisible: false,
            });
            this.props.clientStore!.appointmentModel = undefined;
          }}
          loading={this.props.clientStore?.isGettingAppointmentData}
          data={this.props.clientStore?.appointmentModel}
        />
        <SessionDetails
          visible={this.state.sessionDetailsModalVisible}
          onCancel={() => {
            this.setState({
              sessionDetailsModalVisible: false,
            });
            this.props.clientStore!.sessionModel = undefined;
          }}
          loading={this.props.clientStore?.isGettingSessionData}
          data={this.props.clientStore?.sessionModel}
        />
        <MomentDetails
          visible={this.state.momentDetailsModalVisible}
          onCancel={() => {
            this.setState({
              momentDetailsModalVisible: false,
            });
            this.props.clientStore!.momentModel = undefined;
          }}
          loading={this.props.clientStore?.isGettingMomentData}
          data={this.props.clientStore?.momentModel}
        />
      </Modal>
    );
  }
}

export default ClientDetailsModal;
