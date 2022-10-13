/* eslint-disable */
import React, { useState } from 'react';
import { Modal, Descriptions, Tag, Avatar, Tabs, Table, Image } from 'antd';
import moment from 'moment';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import timingHelper from '../../../lib/timingHelper';
import ImageModel from '../../../components/ImageModal';
import { SessionDto } from '../../../services/session/dto/sessionDto';
import { HeartOutlined, InfoCircleOutlined } from '@ant-design/icons';

interface SessionDetailsProps {
  visible: boolean;
  onCancel: () => void;
  data?: SessionDto;
}

const SessionDetails: React.FC<SessionDetailsProps> = ({ visible, onCancel, data }) => {
  const {
    arTitle,
    enTitle,
    amountOfCalories,
    imageUrl,
    arDescription,
    enDescription,
    creationTime,
    isActive,
    id,
    exercises,
    timeInMinutes,
  } = data || {};

  const [isImageModalOpened, setIsImageModalOpened] = useState(false);
  const [imageModalCaption, setImageModalCaption] = useState('');
  const [imageModalUrl, setImageModalUrl] = useState('');

  const openImageModal = (image: string, caption: string) => {
    setIsImageModalOpened(true);
    setImageModalCaption(caption);
    setImageModalUrl(image);
  };

  const exercisesColumns = [
    {
      title: L('Title'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (image: string) => (
        <Image width={50} height={50} className="event-cover" src={image} />
      ),
    },
    {
      title: L('AmountOfCalories'),
      dataIndex: 'amountOfCalories',
      key: 'amountOfCalories',
    },
    {
      title: L('ExerciseDuration'),
      dataIndex: 'durationInMinutes',
      key: 'durationInMinutes',
    },
    {
      title: L('SessionsCount'),
      dataIndex: 'sessionsCount',
      key: 'sessionsCount',
    },
  ];
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
            <Descriptions.Item label={L('Image')}>
              {' '}
              <div
                onClick={() => openImageModal(imageUrl!, enTitle!)}
                style={{ display: 'inline-block', cursor: 'zoom-in' }}
              >
                <Avatar shape="square" size={50} src={imageUrl} />
              </div>
            </Descriptions.Item>

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
            <Descriptions.Item label={L('SessionTime')}>{timeInMinutes}</Descriptions.Item>
            <Descriptions.Item label={L('AmountOfCalories')}>{amountOfCalories}</Descriptions.Item>

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
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <HeartOutlined />
              {L('Exercises')}
            </span>
          }
          key="3"
        >
          <Table
            columns={exercisesColumns}
            pagination={false}
            style={{ width: '100%', marginTop: 12 }}
            dataSource={exercises || []}
          />
        </Tabs.TabPane>
      </Tabs>

      <ImageModel
        isOpen={isImageModalOpened}
        caption={imageModalCaption}
        src={imageModalUrl}
        onClose={() => {
          closeImageModal();
        }}
      />
    </Modal>
  );
};

export default SessionDetails;
