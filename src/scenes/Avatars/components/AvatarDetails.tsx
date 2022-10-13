/* eslint-disable */
import React, { useState } from 'react';
import { Modal, Descriptions, Tag, Avatar } from 'antd';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import ImageModel from '../../../components/ImageModal';
import { AvatarDto } from '../../../services/avatars/dto';
import { GenderType, MonthName } from '../../../lib/types';

interface AvatarDetailsProps {
  visible: boolean;
  onCancel: () => void;
  avatarData?: AvatarDto;
}

const AvatarDetails: React.FC<AvatarDetailsProps> = ({ visible, onCancel, avatarData }) => {
  const { arName, enName, arDescription, enDescription, gender, month, isActive, image, id } =
    avatarData || {};

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

  const renderMonthName = (month: MonthName) => {
    switch (month) {
      case MonthName.January:
        return <Tag color="blue">{L('January')}</Tag>;
      case MonthName.February:
        return <Tag color="blue">{L('February')}</Tag>;
      case MonthName.March:
        return <Tag color="blue">{L('March')}</Tag>;
      case MonthName.April:
        return <Tag color="blue">{L('April')}</Tag>;
      case MonthName.May:
        return <Tag color="blue">{L('May')}</Tag>;
      case MonthName.June:
        return <Tag color="blue">{L('June')}</Tag>;
      case MonthName.July:
        return <Tag color="blue">{L('July')}</Tag>;
      case MonthName.August:
        return <Tag color="blue">{L('August')}</Tag>;
      case MonthName.September:
        return <Tag color="blue">{L('September')}</Tag>;
      case MonthName.October:
        return <Tag color="blue">{L('October')}</Tag>;
      case MonthName.November:
        return <Tag color="blue">{L('November')}</Tag>;
      case MonthName.December:
        return <Tag color="blue">{L('December')}</Tag>;
      default:
        return <Tag color="blue">{L('NotSet')}</Tag>;
    }
  };
  return (
    <Modal
      width="80%"
      style={{ padding: '20px' }}
      visible={visible}
      title={L('AvatarDetails')}
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
            onClick={() => openImageModal(image!, enName!)}
            style={{ display: 'inline-block', cursor: 'zoom-in' }}
          >
            <Avatar shape="square" size={50} src={image} />
          </div>
        </Descriptions.Item>

        <Descriptions.Item label={L('ArabicName')}>{arName}</Descriptions.Item>
        <Descriptions.Item label={L('EnglishName')}>{enName}</Descriptions.Item>
        <Descriptions.Item label={L('ArabicDescription')}>{arDescription}</Descriptions.Item>
        <Descriptions.Item label={L('EnglishDescription')}>{enDescription}</Descriptions.Item>
        <Descriptions.Item label={L('BirthMonth')}>{renderMonthName(month!)}</Descriptions.Item>

        <Descriptions.Item label={L('Gender')}>
          <Tag color="blue">{gender === GenderType.Female ? L('Female') : L('Male')}</Tag>
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
    </Modal>
  );
};

export default AvatarDetails;
