/* eslint-disable */
import React, { useState } from 'react';
import { Modal, Image, Tooltip, Tag } from 'antd';
import moment from 'moment';
import { PlayCircleOutlined } from '@ant-design/icons';
import VideoPreviewModal from './VideoPreviewModal';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import { StoryDto } from '../../../services/story/dto';
import timingHelper from '../../../lib/timingHelper';
import './storyDetailsModal.css';
import ParagWithSeeMore from '../../../components/ParagWithSeeMore';
import AudioPreviewModal from './AudioPreviewModal';
// import { EditYouTubeLink } from '../utils';

interface StoryDetailsProps {
  visible: boolean;
  onCancel: () => void;
  details?: StoryDto;
}

const StoryDetails: React.FC<StoryDetailsProps> = ({ visible, onCancel, details }) => {
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>();
  const [audioUrl, setAudioUrl] = useState<string>();
  const [audioModalVisible, setAudioModalVisible] = useState(false);

  const openVideoModal = (linkUrl: string) => {
    setVideoModalVisible(true);
    setVideoUrl(linkUrl);
  };
  const openAudioModal = (linkUrl: string) => {
    setAudioModalVisible(true);
    setAudioUrl(linkUrl);
  };
  const {
    creationTime,
    imageUrl,
    videoLink,
    voiceLink,
    createdBy,
    arDescription,
    enDescription,
    arTitle,
    enTitle,
    hours,
    likesCount,
    viewsCount,
    disLikesCount,
    isActive,
  } = details || {};

  return (
    <Modal
      visible={visible}
      title={L('StoryDetails')}
      onCancel={onCancel}
      centered
      destroyOnClose
      maskClosable={false}
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={false}
    >
      <div className="details-wrapper">
        <div className="detail-wrapper">
          <span className="detail-label">{L('CreationDate')}:</span>
          <span className="detail-value">
            {moment(creationTime).format(timingHelper.defaultDateTimeFormat)}
          </span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('CreatedBy')}:</span>
          <span className="detail-value">{(createdBy && createdBy) || L('NotAvailable')}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('ArTitle')}:</span>
          <span className="detail-value">{arTitle || L('NotAvailable')}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('EnTitle')}:</span>
          <span className="detail-value">{enTitle || L('NotAvailable')}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('LikesCount')}:</span>
          <span className="detail-value">{likesCount}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('DisLikesCount')}:</span>
          <span className="detail-value">{disLikesCount}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('ViewsCount')}:</span>
          <span className="detail-value">{viewsCount}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('StoryTime')}:</span>
          <span className="detail-value">{`${hours} ${L('Hour')}`}</span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('IsActive')}:</span>
          <span className="detail-value">
            {isActive ? (
              <Tag color="green" className="ant-tag-disable-pointer">
                {L('Active')}
              </Tag>
            ) : (
              <Tag color="red" className="ant-tag-disable-pointer">
                {L('Inactive')}
              </Tag>
            )}
          </span>
        </div>
        {videoLink && (
          <div className="detail-wrapper">
            <span className="detail-label">{L('StoryVideo')}:</span>
            <span className="detail-value">
              <div className="video-preview video-preview--details">
                <Tooltip placement="top" title={L('ClickToPreviewStoryVideo')}>
                  <PlayCircleOutlined onClick={() => openVideoModal(videoLink)} />
                </Tooltip>
              </div>
            </span>
          </div>
        )}
        {voiceLink && (
          <div className="detail-wrapper">
            <span className="detail-label">{L('StoryAudio')}:</span>
            <span className="detail-value">
              <div className="video-preview video-preview--details">
                <Tooltip placement="top" title={L('ClickToPlayStoryAudio')}>
                  <PlayCircleOutlined onClick={() => openAudioModal(voiceLink)} />
                </Tooltip>
              </div>
            </span>
          </div>
        )}
        {imageUrl && (
          <div className="detail-wrapper">
            <span className="detail-label">{L('Image')}:</span>
            <div className="image-preview image-preview--details">
              <Image className="story-image" width={50} height={50} src={imageUrl} />
            </div>
          </div>
        )}
        <div className="detail-wrapper">
          <span className="detail-label">{L('ArDescription')}:</span>
          <span className="detail-value">
            <ParagWithSeeMore textLength={50} text={`${arDescription}`} />
          </span>
        </div>
        <div className="detail-wrapper">
          <span className="detail-label">{L('EnDescription')}:</span>
          <span className="detail-value">
            <ParagWithSeeMore textLength={50} text={`${enDescription}`} />
          </span>
        </div>
      </div>
      <VideoPreviewModal
        handleCancel={() => setVideoModalVisible(false)}
        videoUrl={videoUrl}
        visible={videoModalVisible}
      />
      <AudioPreviewModal
        handleCancel={() => setAudioModalVisible(false)}
        audioUrl={audioUrl}
        visible={audioModalVisible}
      />
    </Modal>
  );
};
export default StoryDetails;
