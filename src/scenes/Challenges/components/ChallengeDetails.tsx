/* eslint-disable */
import React, { useState } from 'react';
import { Modal, Descriptions, Tag, Avatar } from 'antd';
import moment from 'moment';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import timingHelper from '../../../lib/timingHelper';
import './index.less';
import ImageModel from '../../../components/ImageModal';
import { ChallengeDto, /*StepType*/ } from '../../../services/challenges/dto';
import GoogleMapComp from '../../../components/GoogleMap';

interface ChallengeDetailsProps {
  visible: boolean;
  onCancel: () => void;
  challengeData?: ChallengeDto;
}

const ChallengeDetails: React.FC<ChallengeDetailsProps> = ({
  visible,
  onCancel,
  challengeData,
}) => {
  const {
    arTitle,
    enTitle,
    arDescription,
    enDescription,
    points,
    isActive,
    imageUrl,
    creationTime,
    id,
    minNumOfInvitee,
    isExpired,
    organizer,
    firstLocationLongitude,
    firstLocationLatitude,
    firstLocationName,
    targetLocationLongitude,
    targetLocationLatitude,
    targetLocationName,
    // isJoined,
    // currentStep,
    date,
  } = challengeData || {};

  const [isImageModalOpened, setIsImageModalOpened] = useState(false);
  const [imageModalCaption, setImageModalCaption] = useState('');
  const [imageModalUrl, setImageModalUrl] = useState('');

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
      title={L('ChallengeDetails')}
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
        <Descriptions.Item label={L('ArabicDescription')}>{arDescription}</Descriptions.Item>
        <Descriptions.Item label={L('EnglishDescription')}>{enDescription}</Descriptions.Item>
        <Descriptions.Item label={L('Points')}>{points}</Descriptions.Item>
        <Descriptions.Item label={L('MinNumOfInvitee')}>{minNumOfInvitee}</Descriptions.Item>
        <Descriptions.Item label={L('OrganizerName')}>{organizer}</Descriptions.Item>
        <Descriptions.Item label={L('ChallengeDate')}>
          {moment(date).format(timingHelper.defaultDateFormat)}
        </Descriptions.Item>
        {/* <Descriptions.Item label={L('IsJoined')}>
          {' '}
          {isJoined ? (
            <Tag color="red">{L('Joined')}</Tag>
          ) : (
            <Tag color="green">{L('UnJoined')}</Tag>
          )}
        </Descriptions.Item> */}
        {/* <Descriptions.Item label={L('CurrentStep')}>
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
        </Descriptions.Item> */}

        <Descriptions.Item label={L('FirstLocation')}>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', width: '90%' }}>
            <span>{`${L('LocationName')} : ${firstLocationName}`}</span>
            <GoogleMapComp
              handlePointClick={() => {}}
              withClick
              position={{ lat: +firstLocationLatitude!, lng: +firstLocationLongitude! }}
            />
          </div>
        </Descriptions.Item>
        <Descriptions.Item label={L('TargetLocation')}>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', width: '90%' }}>
            <span>{`${L('LocationName')} : ${targetLocationName}`}</span>

            <GoogleMapComp
              handlePointClick={() => {}}
              withClick
              position={{ lat: +targetLocationLatitude!, lng: +targetLocationLongitude! }}
            />
          </div>
        </Descriptions.Item>
        <Descriptions.Item label={L('CreationDate')}>
          {moment(creationTime).format(timingHelper.defaultDateFormat)}
        </Descriptions.Item>
        <Descriptions.Item label={L('IsExpired')}>
          {' '}
          {isExpired ? (
            <Tag color="red">{L('Expired')}</Tag>
          ) : (
            <Tag color="green">{L('UnExpired')}</Tag>
          )}
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
      <div></div>
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

export default ChallengeDetails;
