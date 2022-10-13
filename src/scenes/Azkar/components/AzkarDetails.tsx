/* eslint-disable */
import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import moment from 'moment';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import timingHelper from '../../../lib/timingHelper';
import { AzkarDto } from '../../../services/azkar/dto';
import './index.less';

interface AzkarDetailsProps {
  visible: boolean;
  onCancel: () => void;
  azkarData?: AzkarDto;
}

const AzkarDetails: React.FC<AzkarDetailsProps> = ({ visible, onCancel, azkarData }) => {
  const {
    arTitle,
    enTitle,
    fromDate,
    toDate,
    isActive,
    arContent,
    enContent,
    category = 0,
    createdBy,
    creationTime,
    id,
  } = azkarData || {};

  const catagories = {
    0: L('morning'),
    1: L('evening'),
    2: L('afterPrayer'),
  };
  return (
    <Modal
      width="800px"
      style={{ padding: '20px' }}
      visible={visible}
      title={L('azkarDetails')}
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
        <Descriptions.Item label={L('Category')}>{catagories[category]}</Descriptions.Item>
        <Descriptions.Item label={L('ArName')}>{arTitle}</Descriptions.Item>
        <Descriptions.Item label={L('EnName')}>{enTitle}</Descriptions.Item>
        <Descriptions.Item label={L('FromDate')}>
          {moment(fromDate).format(timingHelper.defaultDateTimeFormat)}
        </Descriptions.Item>
        <Descriptions.Item label={L('ToDate')}>
          {moment(toDate).format(timingHelper.defaultDateTimeFormat)}
        </Descriptions.Item>
        <Descriptions.Item label={L('azkarArabicContent')}>{arContent}</Descriptions.Item>
        <Descriptions.Item label={L('azkarEnglishContent')}>{enContent}</Descriptions.Item>
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
        <Descriptions.Item label={L('CreatedBy')}>{createdBy}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default AzkarDetails;
