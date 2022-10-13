/* eslint-disable */
import React from 'react';
import { Modal, Descriptions, Tag, Spin, Image } from 'antd';
import moment from 'moment';
import { L } from '../../../../i18next';
import localization from '../../../../lib/localization';
import timingHelper from '../../../../lib/timingHelper';
import { EventOrganizerDto } from '../../../../services/eventOrganizer/dto';

interface OrganizerDetailsProps {
  visible: boolean;
  onCancel: () => void;
  organizerData?: EventOrganizerDto;
  isGettingData?: boolean;
}

const OrganizerDetails: React.FC<OrganizerDetailsProps> = ({
  visible,
  onCancel,
  organizerData = {},
  isGettingData = false,
}) => {
  const {
    name,
    phoneNumber,
    emailAddress,
    isActive,
    userName,
    registrationDate,
    id,
    accountNumber,
    bankName,
    countryCode,
    companyWebsite,
    imageUrl,
    licenseUrl,
    surname,
  } = organizerData || {};

  return (
    <Modal
      width="80%"
      style={{ padding: '20px' }}
      visible={visible}
      title={L('EventOrgabizerDetails')}
      onCancel={onCancel}
      centered
      destroyOnClose
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={false}
    >
      <div className="scrollable-modal">
        {isGettingData ? (
          <div className="loading-comp">
            <Spin size="large" />
          </div>
        ) : (
          <>
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
              <Descriptions.Item label={L('Name')}>
                {`${name ?? ''} ${surname ?? ''}` ?? ''}
              </Descriptions.Item>
              <Descriptions.Item label={L('PhoneNumber')}>
                {(countryCode ?? '') + '' + phoneNumber ?? ''}
              </Descriptions.Item>
              <Descriptions.Item label={L('Email')}>{emailAddress ?? ''}</Descriptions.Item>
              <Descriptions.Item label={L('UserName')}>{userName ?? ''}</Descriptions.Item>
              <Descriptions.Item label={L('VerificationStatus')}>
                <Tag color={isActive ? 'green' : 'volcano'} className="ant-tag-disable-pointer">
                  {isActive ? L('Verified') : L('NotVerified')}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={L('UserName')}>{userName ?? ''}</Descriptions.Item>
              <Descriptions.Item label={L('Bank')}>{bankName ?? ''}</Descriptions.Item>
              <Descriptions.Item label={L('BankAccountNumber')}>
                {accountNumber ?? ''}
              </Descriptions.Item>
              <Descriptions.Item label={L('companyWebsite')}>
                {companyWebsite ?? ''}
              </Descriptions.Item>
              <Descriptions.Item label={L('Image')}>
                {imageUrl !== null && <Image width={50} height={50} src={imageUrl} />}
              </Descriptions.Item>
              <Descriptions.Item label={L('license')}>
                {licenseUrl !== null && <Image width={50} height={50} src={licenseUrl} />}
              </Descriptions.Item>
              <Descriptions.Item label={L('RegistrationDate')}>
                {registrationDate &&
                  moment(registrationDate).format(timingHelper.defaultDateFormat)}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </div>
    </Modal>
  );
};

export default OrganizerDetails;
