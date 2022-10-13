/* eslint-disable */
import * as React from 'react';
import { Tag, Tabs, Image, Spin, Modal, Table, Tooltip } from 'antd';
import moment from 'moment';
import {
  InfoCircleOutlined,
  ContactsOutlined,
  DollarCircleOutlined,
  CalendarOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { popupConfirm } from '../../../lib/popupMessages';

import { L } from '../../../i18next';
import timingHelper from '../../../lib/timingHelper';
import localization from '../../../lib/localization';
import { EventDto } from '../../../services/events/dto/eventDto';
import GoogleMapComp from '../../../components/GoogleMap';
import './eventDetailsStyle.css';
import { EventTypes } from '../../../lib/types';
import AppComponentBase from '../../../components/AppComponentBase';
import { inject, observer } from 'mobx-react';
import Stores from '../../../stores/storeIdentifier';
import EventStore from '../../../stores/eventStore';

const { TabPane } = Tabs;

// eslint-disable-next-line no-shadow
enum IsActiveStatus {
  Inactive = 0,
  Active = 1,
  Closed = 2,
}

interface EventDetailsModalProps {
  loading: boolean;
  eventData?: EventDto;
  eventStore?: EventStore;

  visible: boolean;
  onCancel: () => void;
}
const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.EventStore)
@observer
class EventDetails extends AppComponentBase<EventDetailsModalProps, any> {
  state = {
    eventModalId: 0,
    eventModalOldStatus: 0,
    changeStatusModalVisible: false,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
  };
  // event tickets table
  eventStatus = {
    0: {
      value: IsActiveStatus.Inactive,
      text: L('Inactive'),
      color: 'red',
    },
    1: {
      value: IsActiveStatus.Active,
      text: L('Active'),
      color: 'green',
    },
  };
  eventsTableColumns = [
    {
      title: L('bookingNumber'),
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: L('TicketType'),
      dataIndex: 'ticketType',
      key: 'ticketType',
    },
    {
      title: L('bookingDate'),
      dataIndex: 'bookingDate',
      key: 'bookingDate',
    },
    {
      title: L('bookingStatus'),
      dataIndex: 'bookingStatus',
      key: 'bookingStatus',
    },
    {
      title: L('PayingStatus'),
      dataIndex: 'PayingStatus',
      key: 'PayingStatus',
    },
  ];

  async updateSchedulesList(maxResultCount: number, skipCount: number, parentId: number) {
    await this.props.eventStore!.getSchedules({
      parentId: parentId,
      maxResultCount: maxResultCount,
      skipCount: skipCount,
    });
  }

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateSchedulesList(pageSize, 0, this.props.eventData?.id!);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateSchedulesList(
        this.state.meta.pageSize,
        (page - 1) * this.state.meta.pageSize,
        this.props.eventData?.id!
      );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };
  openDeletePopup = async (id: number) => {
    popupConfirm(async () => {
      await this.props.eventStore!.eventDelete({ id: id });
      await this.updateSchedulesList(
        this.state.meta.pageSize,
        this.state.meta.skipCount,
        this.props.eventData?.id!
      );
    }, L('AreYouSureYouWantToDeleteThisSchedules'));
  };

  eventsSchedulesTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('eventTime'),
      dataIndex: 'startDate',
      key: 'startDate',
      render: (_: any, item: any) => {
        return `${moment(item.startDate).format(timingHelper.defaultDateFormat)}-${moment(
          item.fromHour
        ).format(timingHelper.defaultTimeFormat)} ${L('To')} ${moment(item.endDate).format(
          timingHelper.defaultDateFormat
        )}-${moment(item.toHour).format(timingHelper.defaultTimeFormat)} `;
      },
    },
    // {
    //   title: L('Repeat'),
    //   dataIndex: 'repeat',
    //   key: 'repeat',
    //   render: (repeat: EventOccoursOptions) => {
    //     return (
    //       <Tag color={'processing'} className="ant-tag-disable-pointer">
    //         {repeat === EventOccoursOptions.Daily
    //           ? L('Daily')
    //           : repeat === EventOccoursOptions.None
    //           ? L('None')
    //           : repeat === EventOccoursOptions.Weekly
    //           ? L('Weekly')
    //           : L('Monthly')}
    //       </Tag>
    //     );
    //   },
    // },

    {
      title: L('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <>
          {this.eventStatus[String(status)] && (
            <Tag color={this.eventStatus[String(status)].color} className="ant-tag-disable-pointer">
              {this.eventStatus[String(status)].text}
            </Tag>
          )}
        </>
      ),
    },

    {
      title: L('Action'),
      key: 'action',
      render: (_: string, item: any) => {
        return (
          <div>
            <Tooltip title={L('Delete')}>
              <DeleteOutlined
                className="action-icon"
                onClick={() => this.openDeletePopup(item.id!)}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  public render() {
    const {
      id,
      categoryName,
      arTitle,
      enTitle,
      tags,
      commentsCount = 0,
      likesCount = 0,
      endDate,
      startDate,
      status,
      createdBy,
      creationTime,
      organizer: {
        name = '',
        surname = '',
        companyWebsite = '',
        imageUrl: organizerUrl = '',
        phoneNumber = '',
        emailAddress = '',
      } = {},
      mainPicture,
      gallery = [],
      latitude,
      longitude,
      cityName = '',
      placeName = '',
      about = '',
      buyingMethod,
      totalSeats,
      bookedSeats,
      price,
      silverTicketPrice,
      goldenTicketPrice,
      platinumTicketPrice,
      vipTicketPrice,
      isRefundable,
      tickets = [],
      arDescription,
      arAbout,
      enAbout,
      eventType,
      enDescription,
      arGoldenTicketDescription,
      arVIPTicketDescription,
      arSilverTicketDescription,
      arPlatinumTicketDescription,
      enGoldenTicketDescription,
      enVIPTicketDescription,
      enSilverTicketDescription,
      enPlatinumTicketDescription,
    } = this.props.eventData || {};
    const pagination = {
      ...this.paginationOptions,
      total: this.props.eventStore!.schedulesTotalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Modal
        width="80%"
        style={{ padding: '20px' }}
        visible={this.props.visible}
        title={L('eventDetails')}
        onCancel={this.props.onCancel}
        centered
        destroyOnClose
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={false}
      >
        <div className="scrollable-modal">
          {this.props.loading ? (
            <div className="loading-comp">
              <Spin size="large" />
            </div>
          ) : (
            <div>
              <Tabs defaultActiveKey="1">
                <TabPane
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
                      <span className="detail-label">{L('EventId')}:</span>
                      <span className="detail-value">{id && id}</span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('Category')}:</span>
                      <span className="detail-value">{categoryName && categoryName}</span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('ArName')}:</span>
                      <span className="detail-value">{arTitle && arTitle}</span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('EnName')}:</span>
                      <span className="detail-value">{enTitle && enTitle}</span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('EventTags')}:</span>
                      <span className="detail-value">
                        {tags &&
                          tags.length > 0 &&
                          tags.map((tag: string) => (
                            <Tag key={`${tag}`} className="ant-tag-disable-pointer">
                              {tag}
                            </Tag>
                          ))}
                      </span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('CountOfComments')}:</span>
                      <span className="detail-value">{commentsCount}</span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('CountOfLikes')}:</span>
                      <span className="detail-value">{likesCount}</span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('ArAboutOfEvent')}:</span>
                      <span className="detail-value">{arAbout ?? ''}</span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('EnAboutOfEvent')}:</span>
                      <span className="detail-value">{enAbout ?? ''}</span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('ArDescription')}:</span>
                      <span
                        className="detail-value"
                        dangerouslySetInnerHTML={{ __html: arDescription ?? '' }}
                      />
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('EnDescription')}:</span>
                      <span
                        className="detail-value"
                        dangerouslySetInnerHTML={{ __html: enDescription ?? '' }}
                      />
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('FromDate')}:</span>
                      <span className="detail-value">
                        {moment(startDate).format(timingHelper.defaultDateFormat)}
                      </span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('ToDate')}:</span>
                      <span className="detail-value">
                        {moment(endDate).format(timingHelper.defaultDateFormat)}
                      </span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('IsActive')}:</span>
                      <span className="detail-value">
                        {this.eventStatus[String(status)] && (
                          <Tag
                            color={this.eventStatus[String(status)].color}
                            className="ant-tag-disable-pointer"
                          >
                            {this.eventStatus[String(status)].text}
                          </Tag>
                        )}
                      </span>
                    </div>

                    <div className="detail-wrapper">
                      <span className="detail-label">{L('CreatedBy')}</span>
                      <span className="detail-value">{createdBy && createdBy}</span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('CreationDate')}</span>
                      <span className="detail-value">
                        {creationTime &&
                          moment(creationTime).format(timingHelper.defaultDateTimeFormat)}
                      </span>
                    </div>
                  </div>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <ContactsOutlined />
                      {L('OrganizerInfo')}
                    </span>
                  }
                  key="2"
                >
                  <div className="details-wrapper">
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('OrganizerName')}:</span>
                      <span className="detail-value">{`${name ?? ''} ${surname ?? ''}`}</span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('OrganizerWebsiteLink')}:</span>
                      <span className="detail-value">{companyWebsite ?? ''}</span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('PhoneNumber')}:</span>
                      <span className="detail-value">{phoneNumber ?? ''}</span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('Email')}:</span>
                      <span className="detail-value">{emailAddress ?? ''}</span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('OrganizerImage')}:</span>
                      <span className="detail-value">
                        {organizerUrl !== null && organizerUrl ? (
                          <Image
                            width={50}
                            height={50}
                            className="event-cover"
                            src={organizerUrl}
                          />
                        ) : (
                          <></>
                        )}
                      </span>
                    </div>
                  </div>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <CalendarOutlined />
                      {L('EventInfo')}
                    </span>
                  }
                  key="3"
                >
                  <div className="details-wrapper">
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('EventMainImage')}:</span>
                      <span className="detail-value">
                        {mainPicture && (
                          <Image width={50} height={50} className="event-cover" src={mainPicture} />
                        )}
                      </span>
                    </div>
                    <div className="detail-wrapper event-gallery">
                      <span className="detail-label">{L('EventGallery')}:</span>
                      <span className="detail-value">
                        <Image.PreviewGroup>
                          {gallery &&
                            gallery.length > 0 &&
                            gallery.map((item: string) => (
                              <Image
                                width={50}
                                height={50}
                                key={item}
                                className="event-gallery-item"
                                src={item}
                              />
                            ))}
                        </Image.PreviewGroup>
                      </span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('AboutOfEvent')}:</span>
                      <span className="detail-value">{about && about}</span>
                    </div>
                  </div>
                  {eventType !== EventTypes.Online && (
                    <div className="detail-wrapper event-location">
                      <span className="detail-label">{L('EventLocation')}:</span>
                      <span className="detail-value">
                        {latitude && longitude && (
                          <GoogleMapComp
                            handlePointClick={() => {}}
                            withClick
                            centerLatLng={{ lat: latitude, lng: longitude }}
                            position={{ lat: latitude, lng: longitude }}
                          />
                        )}
                        <ul>
                          <li>
                            {L('City')}: {cityName && cityName}
                          </li>
                          <li>
                            {L('PlaceName')}: {placeName && placeName}
                          </li>
                        </ul>
                      </span>
                    </div>
                  )}
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <DollarCircleOutlined />
                      {L('BookingInfo')}
                    </span>
                  }
                  key="4"
                >
                  <div className="details-wrapper">
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('BuyingMethod')}:</span>
                      <span className="detail-value">
                        {buyingMethod === 0
                          ? L('OnTheApp')
                          : buyingMethod === 1
                          ? L('InOfficialWebsite')
                          : ''}
                      </span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('bookedSeats')}:</span>
                      <span className="detail-value">
                        {bookedSeats}/{totalSeats}
                      </span>
                    </div>
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('isRefundable')}:</span>
                      <span className="detail-value">{isRefundable ? L('Yes') : L('No')}</span>
                    </div>

                    {silverTicketPrice !== null && (
                      <div className="detail-wrapper">
                        <span className="detail-label">{L('silverTicketPrice')}:</span>
                        <span className="detail-value">{silverTicketPrice}</span>
                      </div>
                    )}
                    {goldenTicketPrice !== null && (
                      <div className="detail-wrapper">
                        <span className="detail-label">{L('goldenTicketPrice')}:</span>
                        <span className="detail-value">{goldenTicketPrice}</span>
                      </div>
                    )}
                    {platinumTicketPrice !== null && (
                      <div className="detail-wrapper">
                        <span className="detail-label">{L('platinumTicketPrice')}:</span>
                        <span className="detail-value">{platinumTicketPrice}</span>
                      </div>
                    )}
                    {vipTicketPrice !== null && (
                      <div className="detail-wrapper">
                        <span className="detail-label">{L('vipTicketPrice')}:</span>
                        <span className="detail-value">{vipTicketPrice}</span>
                      </div>
                    )}

                    <div className="detail-wrapper">
                      <span className="detail-label">{L('TicketPrice')}:</span>
                      <span className="detail-value">{price}</span>
                    </div>

                    {arSilverTicketDescription !== null && (
                      <div className="detail-wrapper">
                        <span className="detail-label">{L('ArSilverTicketDescription')}:</span>
                        <span className="detail-value">{arSilverTicketDescription}</span>
                      </div>
                    )}
                    {enSilverTicketDescription !== null && (
                      <div className="detail-wrapper">
                        <span className="detail-label">{L('EnSilverTicketDescription')}:</span>
                        <span className="detail-value">{enSilverTicketDescription}</span>
                      </div>
                    )}
                    {arPlatinumTicketDescription !== null && (
                      <div className="detail-wrapper">
                        <span className="detail-label">{L('ArPlatinumTicketDescription')}:</span>
                        <span className="detail-value">{arPlatinumTicketDescription}</span>
                      </div>
                    )}
                    {enPlatinumTicketDescription !== null && (
                      <div className="detail-wrapper">
                        <span className="detail-label">{L('EnPlatinumTicketDescription')}:</span>
                        <span className="detail-value">{enPlatinumTicketDescription}</span>
                      </div>
                    )}
                    {arVIPTicketDescription !== null && (
                      <div className="detail-wrapper">
                        <span className="detail-label">{L('ArVIPTicketDescription')}:</span>
                        <span className="detail-value">{arVIPTicketDescription}</span>
                      </div>
                    )}
                    {enVIPTicketDescription !== null && (
                      <div className="detail-wrapper">
                        <span className="detail-label">{L('EnVIPTicketDescription')}:</span>
                        <span className="detail-value">{enVIPTicketDescription}</span>
                      </div>
                    )}
                    {arGoldenTicketDescription !== null && (
                      <div className="detail-wrapper">
                        <span className="detail-label">{L('ArGoldenTicketDescription')}:</span>
                        <span className="detail-value">{arGoldenTicketDescription}</span>
                      </div>
                    )}
                    {enGoldenTicketDescription !== null && (
                      <div className="detail-wrapper">
                        <span className="detail-label">{L('EnGoldenTicketDescription')}:</span>
                        <span className="detail-value">{enGoldenTicketDescription}</span>
                      </div>
                    )}
                    <div className="detail-wrapper booking-list">
                      <span className="detail-label">{L('BookingRequestsList')}:</span>
                      {/* TODO: THIS TABLE NEED TO BE MODIFIED WHEN TICKETS DATA IS DONE FROM BE SIDE */}
                      <Table
                        className="event-table"
                        rowKey={(record) => `${record.id}`}
                        dataSource={tickets}
                        columns={this.eventsTableColumns}
                      />
                    </div>
                  </div>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <DollarCircleOutlined />
                      {L('Schedules')}
                    </span>
                  }
                  key="5"
                >
                  <div className="details-wrapper">
                    <div className="detail-wrapper booking-list">
                      <Table
                        className="event-table"
                        rowKey={(record) => `${record.id}`}
                        loading={this.props.eventStore?.loadingSchedules}
                        pagination={pagination}
                        dataSource={this.props.eventStore?.schedules}
                        columns={this.eventsSchedulesTableColumns}
                      />
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          )}
        </div>
      </Modal>
    );
  }
}

export default EventDetails;
