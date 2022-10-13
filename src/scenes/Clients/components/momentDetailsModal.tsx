/* eslint-disable */
import * as React from 'react';
import { Tag, Image, Spin, Modal, Table, Tabs } from 'antd';
import moment from 'moment';

import { L } from '../../../i18next';
import timingHelper from '../../../lib/timingHelper';
import localization from '../../../lib/localization';
import { CommentRefType, InteractionRefType, InteractionType } from '../../../lib/types';
import {
  CommentDto,
  InteractionDto,
  MomentDto,
  MomentTagDto,
} from '../../../services/clients/dto/clientDto';
import { InfoCircleOutlined, YoutubeOutlined } from '@ant-design/icons';
import VideoPreviewModal from '../../Stories/components/VideoPreviewModal';

interface MomentDetailsModalProps {
  loading: boolean;
  data?: MomentDto;
  visible: boolean;
  onCancel: () => void;
}

const MomentDetails: React.FC<MomentDetailsModalProps> = ({ loading, visible, onCancel, data }) => {
  const interactionsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('ClientName'),
      dataIndex: 'client',
      key: 'client',
      render: (_: any, item: InteractionDto) => {
        return item.client.name;
      },
    },

    {
      title: L('InteractionType'),
      dataIndex: 'interactionType',
      key: 'interactionType',
      render: (interactionType: InteractionType) => {
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {interactionType === InteractionType.Angry
              ? L('Angry')
              : interactionType === InteractionType.DisLike
              ? L('DisLike')
              : interactionType === InteractionType.Happy
              ? L('Happy')
              : interactionType === InteractionType.Like
              ? L('Like')
              : interactionType === InteractionType.Love
              ? L('Love')
              : interactionType === InteractionType.Sad
              ? L('Sad')
              : L('Wow')}
          </Tag>
        );
      },
    },
    {
      title: L('InteractionRefType'),
      dataIndex: 'interactionRefType',
      key: 'interactionRefType',
      render: (interactionRefType: InteractionRefType) => {
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {interactionRefType === InteractionRefType.Moment
              ? L('Moment')
              : interactionRefType === InteractionRefType.News
              ? L('News')
              : L('Story')}
          </Tag>
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
  ];
  const [videoUrl, setVideoUrl] = React.useState<string>('');
  const [videoModalVisible, setVideoModalVisible] = React.useState<boolean>(false);

  const handleCancelVideoModal = (): void => {
    setVideoModalVisible(false);
  };
  const openVideoModal = (videoUrl: string): void => {
    setVideoModalVisible(true);
    setVideoUrl(videoUrl);
  };
  const videosTableColumns = [
    {
      title: L('Video'),
      dataIndex: 'videoUrl',
      key: 'videoUrl',
      render: (v: string) => {
        return <YoutubeOutlined style={{ fontSize: 40 }} onClick={() => openVideoModal(v)} />;
      },
    },
    {
      title: L('Description'),
      dataIndex: 'description',
      key: 'description',
    },
  ];
  const commentsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Comment'),
      dataIndex: 'text',
      key: 'text',
    },
    {
      title: L('ClientName'),
      dataIndex: 'client',
      key: 'client',
      render: (_: any, item: CommentDto) => {
        return item.client.name;
      },
    },

    {
      title: L('CommentRefType'),
      dataIndex: 'commentRefType',
      key: 'commentRefType',
      render: (commentRefType: CommentRefType) => {
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {commentRefType === CommentRefType.Event
              ? L('Event')
              : commentRefType === CommentRefType.Moment
              ? L('Moment')
              : commentRefType === CommentRefType.Post
              ? L('Post')
              : L('News')}
          </Tag>
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
  ];

  const {
    caption,
    challenge,
    comments,
    commentsCount,
    creationTime,
    feelingIconUrl,
    id,
    imageUrl,
    interactions,
    interactionsCount,
    songName,
    tags,
    videos,
  } = data || {};

  return (
    <Modal
      width="80%"
      style={{ padding: '20px' }}
      visible={visible}
      title={L('MomentDetails')}
      onCancel={onCancel}
      centered
      destroyOnClose
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={false}
    >
      <div className="scrollable-modal">
        {loading ? (
          <div className="loading-comp">
            <Spin size="large" />
          </div>
        ) : (
          <>
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
                    <span className="detail-label">{L('Id')}:</span>
                    <span className="detail-value">{id}</span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('Caption')}:</span>
                    <span className="detail-value">{caption}</span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('InteractionsCount')}:</span>
                    <span className="detail-value">{interactionsCount}</span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('CommentsCount')}:</span>
                    <span className="detail-value">{commentsCount}</span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('Tags')}:</span>
                    <span className="detail-value">
                      {tags &&
                        tags.length > 0 &&
                        tags.map((item: MomentTagDto) => (
                          <Tag key={item.clientId}>{item.clientName}</Tag>
                        ))}
                    </span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('SongName')}:</span>
                    <span className="detail-value">{songName}</span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('Challenge')}:</span>
                    <span className="detail-value">{challenge && challenge.title}</span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('Image')}:</span>
                    <span className="detail-value">
                      {' '}
                      <Image
                        preview={!!imageUrl}
                        width={50}
                        height={50}
                        src={imageUrl}
                        alt={L('Image')}
                      />
                    </span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('FeelingIcon')}:</span>
                    <span className="detail-value">
                      {' '}
                      <Image
                        preview={!!feelingIconUrl}
                        width={50}
                        height={50}
                        src={feelingIconUrl}
                        alt={L('Image')}
                      />
                    </span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('CreationDate')}</span>
                    <span className="detail-value">
                      {creationTime &&
                        moment(creationTime).format(timingHelper.defaultDateTimeFormat)}
                    </span>
                  </div>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <InfoCircleOutlined />
                    {L('Interactions')}
                  </span>
                }
                key="2"
              >
                <div className="details-wrapper">
                  <div className="detail-wrapper booking-list">
                    <Table
                      className="event-table"
                      rowKey={(record) => `${record.id}`}
                      dataSource={interactions || []}
                      columns={interactionsTableColumns}
                    />
                  </div>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <InfoCircleOutlined />
                    {L('Comments')}
                  </span>
                }
                key="3"
              >
                <div className="details-wrapper">
                  <div className="detail-wrapper booking-list">
                    <Table
                      className="event-table"
                      rowKey={(record) => `${record.id}`}
                      dataSource={comments || []}
                      columns={commentsTableColumns}
                    />
                  </div>
                </div>
              </Tabs.TabPane>

              <Tabs.TabPane
                tab={
                  <span>
                    <InfoCircleOutlined />
                    {L('Videos')}
                  </span>
                }
                key="5"
              >
                {' '}
                <div className="details-wrapper">
                  <div className="detail-wrapper booking-list">
                    <Table
                      className="event-table"
                      rowKey={(record) => `${record.videoUrl}`}
                      dataSource={videos || []}
                      columns={videosTableColumns}
                    />
                  </div>
                </div>
              </Tabs.TabPane>
            </Tabs>
          </>
        )}
      </div>
      <VideoPreviewModal
        handleCancel={handleCancelVideoModal}
        videoUrl={videoUrl}
        visible={videoModalVisible}
      />
    </Modal>
  );
};

export default MomentDetails;
