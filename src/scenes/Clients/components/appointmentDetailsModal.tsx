/* eslint-disable */
import * as React from 'react';
import { Tag, Image, Spin, Modal, Table } from 'antd';
import moment from 'moment';

import { L } from '../../../i18next';
import timingHelper from '../../../lib/timingHelper';
import localization from '../../../lib/localization';
import { AppointmentReminder, AppointmentRepeat, ToDoPriority } from '../../../lib/types';
import { AppointmentDto } from '../../../services/clients/dto/clientDto';

interface AppointmentDetailsModalProps {
  loading: boolean;
  data?: AppointmentDto;
  visible: boolean;
  onCancel: () => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsModalProps> = ({
  loading,
  visible,
  onCancel,
  data,
}) => {
  const clientsTableColumns = [
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: L('PhoneNumber'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: L('EmailAddress'),
      dataIndex: 'emailAddress',
      key: 'emailAddress',
    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string) => {
        return (
          <Image preview={!!imageUrl} width={50} height={50} src={imageUrl} alt={L('Image')} />
        );
      },
    },
    {
      title: L('Points'),
      dataIndex: 'points',
      key: 'points',
    },
    {
      title: L('IsFriend'),
      dataIndex: 'isFriend',
      key: 'isFriend',
      render: (isFriend: boolean) => {
        return (
          <Tag color={isFriend ? 'green' : 'magenta'} className="ant-tag-disable-pointer">
            {isFriend ? L('Yes') : L('No')}
          </Tag>
        );
      },
    },
  ];

  const {
    id,
    allDays,
    clients,
    creationTime,
    endDate,
    fromHour,
    isDone,
    note,
    priority,
    reminder,
    repeat,
    startDate,
    title,
    toHour,
  } = data || {};

  return (
    <Modal
      width="80%"
      style={{ padding: '20px' }}
      visible={visible}
      title={L('AppointmentDetails')}
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
            <div className="details-wrapper">
              <div className="detail-wrapper">
                <span className="detail-label">{L('Id')}:</span>
                <span className="detail-value">{id}</span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Title')}:</span>
                <span className="detail-value">{title}</span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Note')}:</span>
                <span className="detail-value">{note}</span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('AllDays')}:</span>
                <span className="detail-value">
                  <Tag color={allDays ? 'success' : 'magenta'} className="ant-tag-disable-pointer">
                    {allDays ? L('Yes') : L('No')}
                  </Tag>
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Repeat')}:</span>
                <span className="detail-value">
                  <Tag color={'processing'} className="ant-tag-disable-pointer">
                    {repeat === AppointmentRepeat.Daily
                      ? L('Daily')
                      : repeat === AppointmentRepeat.None
                      ? L('None')
                      : repeat === AppointmentRepeat.Weekly
                      ? L('Weekly')
                      : L('EveryMonth')}
                  </Tag>
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Reminder')}:</span>
                <span className="detail-value">
                  <Tag color={'processing'} className="ant-tag-disable-pointer">
                    {reminder === AppointmentReminder.Before15Minutes
                      ? L('Before15Minutes')
                      : reminder === AppointmentReminder.BeforeOneHour
                      ? L('BeforeOneHour')
                      : L('BeforeOneDay')}
                  </Tag>
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Priority')}:</span>
                <span className="detail-value">
                  <Tag color={'processing'} className="ant-tag-disable-pointer">
                    {priority === ToDoPriority.Normal
                      ? L('Normal')
                      : priority === ToDoPriority.VeryImportant
                      ? L('VeryImportant')
                      : L('Important')}
                  </Tag>
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Date')}:</span>
                <span className="detail-value">
                  {moment(startDate).format(timingHelper.defaultDateFormat) +
                    ' ' +
                    L('To') +
                    ' ' +
                    moment(endDate).format(timingHelper.defaultDateFormat)}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Time')}:</span>
                <span className="detail-value">
                  {moment(fromHour).format(timingHelper.defaultTimeFormat) +
                    ' ' +
                    L('To') +
                    ' ' +
                    moment(toHour).format(timingHelper.defaultTimeFormat)}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Status')}:</span>
                <span className="detail-value">
                  <Tag color={isDone ? 'green' : 'magenta'} className="ant-tag-disable-pointer">
                    {isDone ? L('Complete') : L('InComplete')}
                  </Tag>
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('CreationDate')}</span>
                <span className="detail-value">
                  {creationTime && moment(creationTime).format(timingHelper.defaultDateTimeFormat)}
                </span>
              </div>
            </div>

            <div className="details-wrapper">
              <div className="detail-wrapper booking-list">
                <span className="detail-label">{L('ClientsList')}:</span>
                <Table
                  className="event-table"
                  rowKey={(record) => `${record.id}`}
                  dataSource={clients || []}
                  columns={clientsTableColumns}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AppointmentDetails;
