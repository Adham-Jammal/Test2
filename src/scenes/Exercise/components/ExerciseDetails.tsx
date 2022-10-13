/* eslint-disable */
import React, { useState } from 'react';
import { Modal, Descriptions, Tag, Avatar } from 'antd';
import moment from 'moment';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import timingHelper from '../../../lib/timingHelper';
import ImageModel from '../../../components/ImageModal';
import { ExerciseDto } from '../../../services/exercise/dto/exerciseDto';
import { PlayCircleOutlined } from '@ant-design/icons';
import VideoPreviewModal from '../../Stories/components/VideoPreviewModal';

interface ExerciseDetailsProps {
  visible: boolean;
  onCancel: () => void;
  data?: ExerciseDto;
}

const ExerciseDetails: React.FC<ExerciseDetailsProps> = ({ visible, onCancel, data }) => {
  const {
    arTitle,
    enTitle,
    amountOfCalories,
    durationInMinutes,
    imageUrl,
    arDescription,
    enDescription,
    sessionsCount,
    creationTime,
    isActive,
    id,
  } = data || {};

  const [isImageModalOpened, setIsImageModalOpened] = useState(false);
  const [imageModalCaption, setImageModalCaption] = useState('');
  const [imageModalUrl, setImageModalUrl] = useState('');
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>();

  const openVideoModal = (linkUrl: string) => {
    setVideoModalVisible(true);
    setVideoUrl(linkUrl);
  };
  const openImageModal = (image: string, caption: string) => {
    setIsImageModalOpened(true);
    setImageModalCaption(caption);
    setImageModalUrl(image);
  };

  const closeImageModal = () => {
    setIsImageModalOpened(false);
    setImageModalCaption('');
    setImageModalUrl('');
  };
  return (
    <Modal
      width="80%"
      style={{ padding: '20px' }}
      visible={visible}
      title={L('ExerciseDetails')}
      onCancel={onCancel}
      centered
      destroyOnClose
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={false}
    >
      <Descriptions
        className="descriptions-wrap"
        column={{
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 2,
        }}
        layout="vertical"
      >
        <Descriptions.Item label={L('ID')}>{id}</Descriptions.Item>
        {imageUrl && (
          <Descriptions.Item label={L('Media')}>
            {imageUrl.indexOf('.png') > -1 ||
            imageUrl.indexOf('.webp') > -1 ||
            imageUrl.indexOf('.jpeg') > -1 ||
            imageUrl.indexOf('.jpg') > -1 ? (
              <div
                onClick={() => openImageModal(imageUrl!, enTitle!)}
                style={{ display: 'inline-block', cursor: 'zoom-in' }}
              >
                <Avatar shape="square" size={50} src={imageUrl} />
              </div>
            ) : (
              <PlayCircleOutlined
                style={{ fontSize: 40 }}
                onClick={() => openVideoModal(imageUrl)}
              />
            )}
          </Descriptions.Item>
        )}

        <Descriptions.Item label={L('ArName')}>{arTitle}</Descriptions.Item>
        <Descriptions.Item label={L('EnName')}>{enTitle}</Descriptions.Item>
        <Descriptions.Item label={L('ArabicDescription')}>
          {' '}
          <div dangerouslySetInnerHTML={{ __html: arDescription! }} />
        </Descriptions.Item>
        <Descriptions.Item label={L('EnglishDescription')}>
          {' '}
          <div dangerouslySetInnerHTML={{ __html: enDescription! }} />
        </Descriptions.Item>
        <Descriptions.Item label={L('ExerciseDuration')}>{durationInMinutes}</Descriptions.Item>
        <Descriptions.Item label={L('AmountOfCalories')}>{amountOfCalories}</Descriptions.Item>
        <Descriptions.Item label={L('SessionsCount')}>{sessionsCount}</Descriptions.Item>

        <Descriptions.Item label={L('CreationDate')}>
          {moment(creationTime).format(timingHelper.defaultDateFormat)}
        </Descriptions.Item>

        <Descriptions.Item label={L('IsActive')}>
          {' '}
          {isActive ? (
            <Tag color="green">{L('Active')}</Tag>
          ) : (
            <Tag color="red">{L('Inactive')}</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>
      <ImageModel
        isOpen={isImageModalOpened}
        caption={imageModalCaption}
        src={imageModalUrl}
        onClose={() => {
          closeImageModal();
        }}
      />
      <VideoPreviewModal
        handleCancel={() => setVideoModalVisible(false)}
        videoUrl={videoUrl}
        visible={videoModalVisible}
      />
    </Modal>
  );
};

export default ExerciseDetails;
