/* eslint-disable */
import * as React from 'react';
import { Card, Table, Image, Button, Tooltip, Tag, Row, Col, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import { arrayMoveImmutable } from 'array-move';
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortableHandle,
  SortEnd,
} from 'react-sortable-hoc';

import {
  PlayCircleOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  CheckSquareOutlined,
  StopOutlined,
  DeleteOutlined,
  YoutubeOutlined,
  MenuOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { FormInstance } from 'antd/lib/form';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import timingHelper from '../../lib/timingHelper';
import SearchComponent from '../../components/SearchComponent';
import StoryStore from '../../stores/storyStore';
import {
  StoryDto,
  CreateStoryDto,
  UpdateStoryDto,
  UpdateStoriesOrderDto,
} from '../../services/story/dto';
import VideoPreviewModal from './components/VideoPreviewModal';
import CreateStory from './components/createStory';
import StoryDetailsModal from './components/storyDetailsModal';
import './index.css';
import { EntityDto } from '../../services/dto/entityDto';
import { popupConfirm } from '../../lib/popupMessages';
import FilterationBox from '../../components/FilterationBox';
import AudioPreviewModal from './components/AudioPreviewModal';
import localization from '../../lib/localization';
import storyService from '../../services/story/storyService';

export interface StoriesProps {
  storyStore: StoryStore;
}

export interface StoriesState {
  storyModalId: number;
  updateOrdering: boolean;
  storyModalType: string;
  dataSource: Array<StoryDto>;

  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  isActiveFilter?: boolean;
  keyword?: string;
  advancedSearchKeyword?: string;
  createStoryModalVisible: boolean;
  storyData?: StoryDto;
  videoUrl?: string;
  videoModalVisible: boolean;
  detailsModalVisible: boolean;
  audioModalVisible: boolean;
  audioUrl?: string;
}
const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));
const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 6 },
  xl: { span: 6 },
  xxl: { span: 6 },
};

const INDEX_PAGE_SIZE_DEFAULT = 8;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];
declare let abp: any;

@inject(Stores.StoryStore)
@observer
export class Stories extends AppComponentBase<StoriesProps, StoriesState> {
  formRef = React.createRef<FormInstance>();

  state = {
    storyModalId: 0,
    storyModalType: 'Create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    dataSource: [],

    isActiveFilter: undefined,
    keyword: undefined,
    advancedSearchKeyword: undefined,
    createStoryModalVisible: false,
    storyData: undefined,
    videoUrl: undefined,
    videoModalVisible: false,
    detailsModalVisible: false,
    audioUrl: undefined,
    audioModalVisible: false,
    updateOrdering: false,
  };

  async componentDidMount() {
    this.updateStoriesList(this.state.meta.pageSize, 0);
  }

  openCreateStoryModal() {
    this.setState({ createStoryModalVisible: true });
  }

  async updateStoriesList(
    maxResultCount: number,
    skipCount: number,
    sorting?: string
  ): Promise<void> {
    this.props.storyStore!.maxResultCount = maxResultCount;
    this.props.storyStore!.skipCount = skipCount;
    this.props.storyStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.storyStore!.keyword = this.state.keyword;
    this.props.storyStore!.advancedSearchKeyword = this.state.advancedSearchKeyword;
    this.props.storyStore!.sorting = sorting;

    await this.props.storyStore!.getStories();
    this.setState({
      dataSource: this.props.storyStore!.stories.sort(function (a: any, b: any) {
        return a.order - b.order;
      }),
    });
  }

  onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    let temp: any = [];
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(this.state.dataSource.slice(), oldIndex, newIndex).filter(
        (el: StoryDto) => !!el
      );
      newData.map((item: StoryDto, index: number) => {
        temp.push({ ...item, order: index });
      });
      this.setState({ dataSource: temp, updateOrdering: true });
    }
  };

  updateOrdering = async () => {
    const data: UpdateStoriesOrderDto = { stories: [] };
    this.state.dataSource.map((item: StoryDto) => {
      data.stories.push({ id: item.id, order: item.order });
    });
    await storyService.updateOrders(data);
  };

  DraggableContainer = (props: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}
    />
  );

  DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = this.state.dataSource.findIndex(
      (x: StoryDto) => x.order === restProps['data-row-key']
    );
    return <SortableItem index={index} {...restProps} />;
  };

  handleCancelVideoModal = (): void => {
    this.setState({ videoModalVisible: false });
  };
  handleCancelAudioModal = (): void => {
    this.setState({ audioModalVisible: false });
  };

  openVideoModal = (videoUrl: string): void => {
    this.setState({ videoModalVisible: true, videoUrl });
  };
  openAudioModal = (audioUrl: string): void => {
    this.setState({ audioModalVisible: true, audioUrl });
  };

  openAddStoryModal = async (entityDto: EntityDto) => {
    if (entityDto.id === 0) {
      this.props.storyStore!.storyModel = undefined;
      this.setState({ storyModalType: 'Create', storyModalId: entityDto.id });
    } else {
      await this.props.storyStore!.getStory(entityDto);
      this.setState({ storyModalType: 'Edit', storyModalId: entityDto.id });
    }
    this.setState({
      createStoryModalVisible: !this.state.createStoryModalVisible,
      storyModalId: entityDto.id,
    });
  };

  openStoryDetailsModal = (details: StoryDto): void => {
    this.setState({ detailsModalVisible: true, storyData: details });
  };

  onCreateStoryModalCancel = (): void => {
    this.setState({ createStoryModalVisible: false });
  };

  onCreateStoryOk = async (values: any): Promise<void> => {
    if (this.state.storyModalType === 'Create') {
      await this.props.storyStore!.createStory(values as CreateStoryDto);
    } else {
      values.id = this.state.storyModalId;
      await this.props.storyStore!.updateStory(values as UpdateStoryDto);
    }
    this.updateStoriesList(this.state.meta.pageSize, 0);
    this.setState({ createStoryModalVisible: false });
  };

  onSwitchNewsActivation = async (story: StoryDto) => {
    popupConfirm(
      async () => {
        if (story.isActive) await this.props.storyStore!.deActivateStory({ id: story.id });
        else await this.props.storyStore!.activateStory({ id: story.id });
        await this.updateStoriesList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      story.isActive
        ? L('AreYouSureYouWantToDeactivateThisStory')
        : L('AreYouSureYouWantToActivateThisStory')
    );
  };

  // Handle Delete Story Modal
  onDeleteStory = async (entityDto: EntityDto) => {
    popupConfirm(async () => {
      await this.props.storyStore!.deleteStory({ id: entityDto.id });
      await this.updateStoriesList(this.state.meta.pageSize, this.state.meta.skipCount);
    }, L('AreYouSureYouWantToDeleteThisStory'));
  };

  // Handle Table Changes (Sorting Culomns)
  handleTableChange = (pagination: any, filters: any, sorter: any): void => {
    if (sorter.order === 'ascend') {
      this.updateStoriesList(this.state.meta.pageSize, 0, `${sorter.columnKey} ASC`);
    } else if (sorter.order === 'descend') {
      this.updateStoriesList(this.state.meta.pageSize, 0, `${sorter.columnKey} DESC`);
    } else {
      this.updateStoriesList(this.state.meta.pageSize, 0);
    }
  };

  storiesTableColumns = [
    {
      title: '',
      dataIndex: 'sort',
      width: 20,
      className: 'drag-visible',
      render: (_: any, item: StoryDto) =>
        item.isActive && !item.isExpired ? (
          <DragHandle />
        ) : (
          <Tooltip title={L('YouCantOrderThisStory')}>
            <MenuOutlined style={{ cursor: 'no-drop', color: '#999' }} />
          </Tooltip>
        ),
    },
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
      title: L('ViewsCount'),
      dataIndex: 'viewsCount',
      key: 'ViewsCount',
      sorter: true,
    },
    {
      title: L('storyMedia'),
      dataIndex: 'viewsCount',
      key: 'ViewsCount',
      render: (_: any, record: StoryDto) => {
        return (
          <div className="video-preview" style={{ width: 'fit-content', display: 'inline-block' }}>
            <Tooltip placement="top" title={L('ClickToPreviewStoryMedia')}>
              {record.videoLink !== null ? (
                <YoutubeOutlined onClick={() => this.openVideoModal(record.videoLink)} />
              ) : record!.voiceLink ? (
                <PlayCircleOutlined onClick={() => this.openAudioModal(record!.voiceLink)} />
              ) : (
                <Image className="story-image" width={50} height={50} src={record!.imageUrl} />
              )}
            </Tooltip>
          </div>
        );
      },
    },

    // {
    //   title: L('LikesCount'),
    //   dataIndex: 'likesCount',
    //   key: 'LikesCount',
    //   sorter: true,
    // },
    // {
    //   title: L('DisLikesCount'),
    //   dataIndex: 'disLikesCount',
    //   key: 'disLikesCount',
    //   sorter: true,
    // },
    {
      title: L('IsExpired'),
      dataIndex: 'isExpired',
      key: 'isExpired',
      render: (isExpired: boolean) => {
        return (
          <Tag color={isExpired ? 'magenta' : 'green'} className="ant-tag-disable-pointer">
            {isExpired ? L('Expired') : L('UnExpired')}
          </Tag>
        );
      },
    },
    {
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => {
        if (isActive) {
          return (
            <Tag color="green" className="ant-tag-disable-pointer">
              {L('Active')}
            </Tag>
          );
        } else {
          return (
            <Tag color="red" className="ant-tag-disable-pointer">
              {L('Inactive')}
            </Tag>
          );
        }
      },
    },
    {
      title: L('CreationDate'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (creationTime: string) => moment(creationTime).format(timingHelper.defaultDateFormat),
    },
    {
      title: L('Action'),
      key: 'action',
      render: (_: string, item: StoryDto): JSX.Element => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined className="action-icon" onClick={() => this.openStoryDetailsModal(item)} />
          </Tooltip>
          <Tooltip title={L('Edit')}>
            <EditOutlined
              className="action-icon"
              onClick={() => this.openAddStoryModal({ id: item.id })}
            />
          </Tooltip>
          {item.isActive ? (
            <Tooltip title={L('Deactivate')}>
              <StopOutlined
                className="action-icon red-text"
                onClick={() => this.onSwitchNewsActivation(item)}
              />
            </Tooltip>
          ) : (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon green-text"
                onClick={() => this.onSwitchNewsActivation(item)}
              />
            </Tooltip>
          )}
          <Tooltip title={L('Delete')}>
            <DeleteOutlined
              className="action-icon"
              onClick={() => this.onDeleteStory({ id: item.id })}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (_: any, pageSize: number): Promise<void> => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateStoriesList(pageSize, 0);
    },
    onChange: async (page: number): Promise<void> => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateStoriesList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: number, range: number[]): string =>
      `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const {
      videoUrl,
      meta: { page, pageSize } = {},
      videoModalVisible,
      audioModalVisible,
      audioUrl,
      storyData,
      createStoryModalVisible,
      detailsModalVisible,
    } = this.state;
    const { isSubmittingStory, totalCount, loadingStories } = this.props.storyStore!;
    const pagination = {
      ...this.paginationOptions,
      total: totalCount,
      current: page,
      pageSize,
    };
    return (
      <Card
        title={
          <>
            <span>{L('Stories')}</span>
            <Button
              type="primary"
              style={{ float: localization.getFloat() }}
              icon={<PlusOutlined />}
              onClick={() => {
                this.openAddStoryModal({ id: 0 });
                return this.formRef.current?.resetFields();
              }}
            >
              {L('AddStory')}
            </Button>
            {this.state.updateOrdering && (
              <>
                <Button
                  style={{ float: localization.getFloat(), margin: '0 5px' }}
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={async () => {
                    this.setState({ updateOrdering: false });
                    await this.updateOrdering();
                    await this.updateStoriesList(
                      this.state.meta.pageSize,
                      this.state.meta.skipCount
                    );
                  }}
                >
                  {L('SaveOrdering')}
                </Button>
                <Button
                  style={{ float: localization.getFloat(), margin: '0 5px' }}
                  type="default"
                  icon={<CloseOutlined />}
                  onClick={async () => {
                    this.setState({ updateOrdering: false });
                    await this.updateStoriesList(
                      this.state.meta.pageSize,
                      this.state.meta.skipCount
                    );
                  }}
                >
                  {L('DiscardOrdering')}
                </Button>
              </>
            )}
          </>
        }
      >
        <SearchComponent
          placeHolder={L('SearchByTitle')}
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateStoriesList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />

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
                    isActiveFilter: value,
                  });
                }}
                defaultValue={this.state.isActiveFilter}
                value={this.state.isActiveFilter}
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
                await this.updateStoriesList(this.state.meta.pageSize, this.state.meta.skipCount);
              }}
              style={{ width: 90 }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ isActiveFilter: undefined }, async () => {
                  await this.updateStoriesList(this.state.meta.pageSize, this.state.meta.skipCount);
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
          rowKey={(record) => record.order}
          style={{ marginTop: '12px' }}
          loading={loadingStories}
          dataSource={this.state.dataSource || []}
          components={{
            body: {
              wrapper: this.DraggableContainer,
              row: this.DraggableBodyRow,
            },
          }}
          columns={this.storiesTableColumns}
          onChange={this.handleTableChange}
          // expandable={{
          //   expandIcon: ({ expanded, onExpand, record }) =>
          //     expanded ? (
          //       <UpOutlined className="expand-icon" onClick={(e) => onExpand(record, e)} />
          //     ) : (
          //       <DownOutlined className="expand-icon" onClick={(e) => onExpand(record, e)} />
          //     ),
          //   expandedRowRender: (record) => (
          //     <p className="expanded-row" style={{ margin: 0 }}>
          //       <span>
          //         <b>{L('storyMedia')}: </b>
          //         <div
          //           className="video-preview"
          //           style={{ width: 'fit-content', display: 'inline-block' }}
          //         >
          //           <Tooltip placement="top" title={L('ClickToPreviewStoryMedia')}>
          //             {record.videoLink !== null ? (
          //               <YoutubeOutlined onClick={() => this.openVideoModal(record.videoLink)} />
          //             ) : record!.voiceLink ? (
          //               <PlayCircleOutlined
          //                 onClick={() => this.openAudioModal(record!.voiceLink)}
          //               />
          //             ) : (
          //               <Image
          //                 className="story-image"
          //                 width={50}
          //                 height={50}
          //                 src={record!.imageUrl}
          //               />
          //             )}
          //           </Tooltip>
          //         </div>
          //       </span>

          //       <span>
          //         <b>{L('CreatedBy')}:</b> {record.createdBy}
          //       </span>
          //       <span>
          //         <b>{L('CreationDate')}:</b>{' '}
          //         {moment(record.creationTime).format(timingHelper.defaultDateFormat)}
          //       </span>
          //     </p>
          //   ),
          //   rowExpandable: (record) => true,
          // }}
        />
        <VideoPreviewModal
          handleCancel={this.handleCancelVideoModal}
          videoUrl={videoUrl}
          visible={videoModalVisible}
        />
        <AudioPreviewModal
          handleCancel={this.handleCancelAudioModal}
          audioUrl={audioUrl}
          visible={audioModalVisible}
        />
        {createStoryModalVisible && (
          <CreateStory
            onOk={this.onCreateStoryOk}
            onCancel={this.onCreateStoryModalCancel}
            isSubmittingStory={isSubmittingStory}
            visible={createStoryModalVisible}
            storyModel={this.props.storyStore!.storyModel}
            modalType={this.state.storyModalType}
          />
        )}

        <StoryDetailsModal
          details={storyData}
          visible={detailsModalVisible}
          onCancel={() => this.setState({ detailsModalVisible: false })}
        />
      </Card>
    );
  }
}

export default Stories;
