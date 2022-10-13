/* eslint-disable */
import React, { useState } from 'react';
import { Modal, Descriptions, Tag, Row, Divider, Col, Avatar } from 'antd';
import moment from 'moment';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import timingHelper from '../../../lib/timingHelper';
import './index.less';
import ImageModel from '../../../components/ImageModal';
import { QuestionDto } from '../../../services/questions/dto';
import { QuestionType } from '../../../lib/types';

interface QuestionDetailsProps {
  visible: boolean;
  onCancel: () => void;
  questionData?: QuestionDto;
}

const QuestionDetails: React.FC<QuestionDetailsProps> = ({ visible, onCancel, questionData }) => {
  const { isActive, creationTime, id, arContent, choices, enContent, order, type } =
    questionData || {};

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
      title={L('QuestionDetails')}
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

        <Descriptions.Item label={L('Order')}>{order}</Descriptions.Item>

        <Descriptions.Item label={L('ArContent')}>{arContent}</Descriptions.Item>
        <Descriptions.Item label={L('EnContent')}>{enContent}</Descriptions.Item>
        <Descriptions.Item label={L('Type')}>
          <Tag color="blue">
            {type === QuestionType.Personality ? L('Personality') : L('Preference')}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label={L('IsActive')}>
          {' '}
          {isActive ? (
            <Tag color="green">{L('Active')}</Tag>
          ) : (
            <Tag color="red">{L('Inactive')}</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label={L('CreationDate')}>
          {moment(creationTime).format(timingHelper.defaultDateFormat)}
        </Descriptions.Item>
      </Descriptions>
      <h3>{L('Choices')}</h3>
      <Divider />
      {choices?.map((choice, index) => {
        return (
          <>
            <Row key={index}>
              <Col
                xs={{ span: 24, offset: 0 }}
                md={{ span: 24, offset: 0 }}
                lg={{ span: 9, offset: 0 }}
              >
                <Descriptions.Item label={L('ArContent')}>{choice.arContent}</Descriptions.Item>
              </Col>
              <Col
                xs={{ span: 24, offset: 0 }}
                md={{ span: 24, offset: 0 }}
                lg={{ span: 9, offset: 2 }}
              >
                {' '}
                <Descriptions.Item label={L('EnContent')}>{choice.enContent}</Descriptions.Item>
              </Col>
              <Col
                xs={{ span: 24, offset: 0 }}
                md={{ span: 24, offset: 0 }}
                lg={{ span: 3, offset: 1 }}
              >
                <Descriptions.Item label={L('ChoiceImage')}>
                  {' '}
                  <div
                    onClick={() => openImageModal(choice.imageUrl!, choice.enContent!)}
                    style={{ display: 'inline-block', cursor: 'zoom-in' }}
                  >
                    <Avatar shape="square" size={45} src={choice.imageUrl} />
                  </div>
                </Descriptions.Item>
              </Col>
            </Row>
            <Divider />
          </>
        );
      })}

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

export default QuestionDetails;
