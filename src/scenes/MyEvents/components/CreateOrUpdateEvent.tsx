/* eslint-disable */

import React, { useEffect, useState } from 'react';
import {
  Form,
  Button,
  Result,
  Steps,
  Modal,
  Spin,
  Input,
  Select,
  Row,
  Col,
  Radio,
  RadioChangeEvent,
  DatePicker,
  InputNumber,
  TimePicker,
} from 'antd';
import { LeftOutlined, PlusOutlined, RightOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { L } from '../../../i18next';
import * as RULES from './validationRules';
import localization from '../../../lib/localization';
import { LiteEntityDto } from '../../../services/dto/liteEntityDto';
import { EventDto } from '../../../services/events/dto/eventDto';
import { CreateOrUpdateEventDto } from '../../../services/events/dto/createOrUpdateEventDto';
import './index.css';
import { useStepsForm } from 'sunflower-antd';
import { arabicNameRules, englishNameRules } from '../../../constants';
import { EventTypes, FeesType, TicketCategory } from '../../../lib/types';
import GoogleMapComp from '../../../components/GoogleMap';
import EditableImage from '../../../components/EditableImage';
import UploadImage from '../../../components/UploadImage';
import { CKEditor } from 'ckeditor4-react';
import { convertImagesUrlsToImageArr, convertImageToImageArr } from '../helpers';
import { ImageAttr } from '../../../services/dto/imageAttr';
import EditableTags from '../../../components/EditableTags';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import EventScheduleModal from '../../Events/components/eventScheduleModal';
import timingHelper from '../../../lib/timingHelper';

const localizer = momentLocalizer(moment);

interface CreateOrUpdateEventProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: (values: CreateOrUpdateEventDto) => Promise<number>;
  isSubmittingEvent: boolean;
  isGettingData: boolean;
  eventData?: EventDto;
  eventCategories: any[];
  cities?: LiteEntityDto[];
  eventOrganizers?: LiteEntityDto[];
  feesPercentage: number;
}

const { Step } = Steps;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
declare let abp: any;

const eventTypesOptions = [
  {
    label: (
      <span className="event-box">
        <span className="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3V4M12 20V21M21 12H20M4 12H3M18.364 18.364L17.6569 17.6569M6.34315 6.34315L5.63604 5.63604M18.364 5.63609L17.6569 6.3432M6.3432 17.6569L5.63609 18.364M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
              className="orange"
              stroke="#2C272E"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span className="info">
          <span className="title">{L('Free')}</span>
          <span className="desc">{L('FreeDesc')}</span>
        </span>
      </span>
    ),
    value: EventTypes.Free,
  },
  {
    label: (
      <span className="event-box">
        <span className="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 10V11C21.5523 11 22 10.5523 22 10H21ZM21 14H22C22 13.4477 21.5523 13 21 13V14ZM3 14V13C2.44772 13 2 13.4477 2 14H3ZM3 10H2C2 10.5523 2.44772 11 3 11V10ZM5 4C3.34315 4 2 5.34315 2 7H4C4 6.44772 4.44772 6 5 6V4ZM19 4H5V6H19V4ZM22 7C22 5.34315 20.6569 4 19 4V6C19.5523 6 20 6.44772 20 7H22ZM22 10V7H20V10H22ZM20 12C20 11.4477 20.4477 11 21 11V9C19.3431 9 18 10.3431 18 12H20ZM21 13C20.4477 13 20 12.5523 20 12H18C18 13.6569 19.3431 15 21 15V13ZM22 17V14H20V17H22ZM19 20C20.6569 20 22 18.6569 22 17H20C20 17.5523 19.5523 18 19 18V20ZM5 20H19V18H5V20ZM2 17C2 18.6569 3.34315 20 5 20V18C4.44772 18 4 17.5523 4 17H2ZM2 14V17H4V14H2ZM4 12C4 12.5523 3.55228 13 3 13V15C4.65685 15 6 13.6569 6 12H4ZM3 11C3.55228 11 4 11.4477 4 12H6C6 10.3431 4.65685 9 3 9V11ZM2 7V10H4V7H2Z"
              fill="#2C272E"
              className="orange-fill"
            />
            <path
              d="M15 5V7"
              stroke="#111827"
              className="orange"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M15 11V13"
              stroke="#111827"
              className="orange"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15 17V19"
              stroke="#111827"
              className="orange"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span className="info">
          <span className="title">{L('PayWithEnterance')}</span>
          <span className="desc">{L('PayWithEnteranceDesc')}</span>
        </span>
      </span>
    ),
    value: EventTypes.PayWithEnterance,
  },
  {
    label: (
      <span className="event-box">
        <span className="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V7C20 7.55228 19.5523 8 19 8H5C4.44772 8 4 7.55228 4 7V5Z"
              stroke="#2C272E"
              className="orange"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4 13C4 12.4477 4.44772 12 5 12H11C11.5523 12 12 12.4477 12 13V19C12 19.5523 11.5523 20 11 20H5C4.44772 20 4 19.5523 4 19V13Z"
              stroke="#2C272E"
              className="orange"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16 13C16 12.4477 16.4477 12 17 12H19C19.5523 12 20 12.4477 20 13V19C20 19.5523 19.5523 20 19 20H17C16.4477 20 16 19.5523 16 19V13Z"
              stroke="#2C272E"
              className="orange"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span className="info">
          <span className="title">{L('PayWithSeats')}</span>
          <span className="desc">{L('PayWithSeatsDesc')}</span>
        </span>
      </span>
    ),
    value: EventTypes.PayWithSeats,
  },
  {
    label: (
      <span className="event-box">
        <span className="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 12L11 14L15 10M20.6179 5.98434C20.4132 5.99472 20.2072 5.99997 20 5.99997C16.9265 5.99997 14.123 4.84453 11.9999 2.94434C9.87691 4.84446 7.07339 5.99985 4 5.99985C3.79277 5.99985 3.58678 5.9946 3.38213 5.98422C3.1327 6.94783 3 7.95842 3 9.00001C3 14.5915 6.82432 19.2898 12 20.622C17.1757 19.2898 21 14.5915 21 9.00001C21 7.95847 20.8673 6.94791 20.6179 5.98434Z"
              stroke="#2C272E"
              className="orange"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span className="info">
          <span className="title">{L('Private')}</span>
          <span className="desc">{L('PrivateDesc')}</span>
        </span>
      </span>
    ),
    value: EventTypes.Private,
  },
  {
    label: (
      <span className="event-box">
        <span className="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.05493 11H5C6.10457 11 7 11.8954 7 13V14C7 15.1046 7.89543 16 9 16C10.1046 16 11 16.8954 11 18V20.9451M8 3.93552V5.5C8 6.88071 9.11929 8 10.5 8H11C12.1046 8 13 8.89543 13 10C13 11.1046 13.8954 12 15 12C16.1046 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8L20.0645 8M15 20.4879V18C15 16.8954 15.8954 16 17 16H20.0645M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="#2C272E"
              className="orange"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span className="info">
          <span className="title">{L('Online')}</span>
          <span className="desc">{L('OnlineDesc')}</span>
        </span>
      </span>
    ),
    value: EventTypes.Online,
  },
];

const CreateOrUpdateEvent: React.FC<CreateOrUpdateEventProps> = ({
  visible,
  onCancel,
  modalType,
  onOk,
  isSubmittingEvent,
  isGettingData,
  eventData,
  eventCategories,
  cities = [],
  feesPercentage,
}) => {
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [eventMainImage, setEventMainImage] = useState<ImageAttr[]>([]);
  const [galleryImages, setGalleryImages] = useState<ImageAttr[]>([]);
  const [ticketCatagories, setTicketCatagories] = useState<number[]>([]);
  const [arDesc, setArDesc] = useState<string>();
  const [enDesc, setEnDesc] = useState<string>();
  const [eventType, setEventType] = useState<number>(0);
  const [tagsData, setTagsData] = useState<string[]>([]);
  const [recurringEvent, setRecurringEvent] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<boolean>(false);
  const [openScheduleModal, setOpenScheduleModal] = useState<boolean>(false);
  const [scheduleData, setScheduleData] = useState<Array<any>>([]);
  const [schedules, setSchedules] = useState<Array<any>>([]);

  useEffect(() => {
    if (eventData && modalType === 'update') {
      const {
        latitude,
        longitude,
        arDescription,
        enDescription,
        endDate,
        startDate,
        cityId,
        fromHour,
        toHour,
        eventType,
        tags,
        hideComments = false,
        schedules,
      } = eventData;
      setLat(latitude);
      setLng(longitude);
      setArDesc(arDescription);
      setEnDesc(enDescription);
      setEventType(eventType);
      setTagsData(tags);
      setSchedules(schedules);
      if (schedules.length > 0) {
        setRecurringEvent(true);
        let temp: any[] = [];
        schedules.map((item: EventDto) => {
          //  if (item.status === 1) {
          //  if (item.repeat === EventOccoursOptions.None) {
          temp.push({
            title:
              moment(item.fromHour).format(timingHelper.defaultTimeFormat) +
              ' - ' +
              moment(item.toHour).format(timingHelper.defaultTimeFormat),
            start: moment(item.startDate).format(timingHelper.defaultDateFormat),
            end: moment(item.endDate).format(timingHelper.defaultDateFormat),
          });
        });
        // } else if (item.repeat === EventOccoursOptions.Daily) {
        //       let start = moment(item.startDate);
        //       while (start.isSameOrBefore(item.endDate)) {
        //         temp.push({
        //           title:
        //             moment(item.fromHour).format(timingHelper.defaultTimeFormat) +
        //             ' - ' +
        //             moment(item.toHour).format(timingHelper.defaultTimeFormat),
        //           start: moment(start).format(timingHelper.defaultDateFormat),
        //           end: moment(item.endDate).format(timingHelper.defaultDateFormat),
        //         });
        //         start.add(1, 'days');
        //       }
        //     } else if (item.repeat === EventOccoursOptions.Weekly) {
        //       let start = moment(item.startDate);
        //       while (start.isSameOrBefore(item.endDate)) {
        //         temp.push({
        //           title:
        //             moment(item.fromHour).format(timingHelper.defaultTimeFormat) +
        //             ' - ' +
        //             moment(item.toHour).format(timingHelper.defaultTimeFormat),
        //           start: moment(start).format(timingHelper.defaultDateFormat),
        //           end: moment(item.endDate).format(timingHelper.defaultDateFormat),
        //         });
        //         start.add(7, 'days');
        //       }
        //     } else if (item.repeat === EventOccoursOptions.Monthly) {
        //       let start = moment(item.startDate);
        //       while (start.isSameOrBefore(item.endDate)) {
        //         temp.push({
        //           title:
        //             moment(item.fromHour).format(timingHelper.defaultTimeFormat) +
        //             ' - ' +
        //             moment(item.toHour).format(timingHelper.defaultTimeFormat),
        //           start: moment(start).format(timingHelper.defaultDateFormat),
        //           end: moment(item.endDate).format(timingHelper.defaultDateFormat),
        //         });
        //         start.add(1, 'M');
        //       }
        //     }
        //   }
        // });
        setScheduleData(temp);
      }
      const newEventData = {
        ...eventData,
        placeDescription: { lat: latitude, lng: longitude },
        endDate: moment(endDate),
        startDate: moment(startDate),
        fromHour: moment(fromHour),
        toHour: moment(toHour),
        cityId: String(cityId),
        hideComments,
      };
      form.setFieldsValue(newEventData);
    }
  }, [eventData]);

  // change the images state when change the event data
  useEffect(() => {
    if (eventData && modalType === 'update') {
      console.log('ss', eventData);
      const {
        mainPicture,
        gallery,
        silverTicketPrice,
        goldenTicketPrice,
        platinumTicketPrice,
        vipTicketPrice,
      } = eventData;
      setEventMainImage(convertImageToImageArr(mainPicture, 'eventMainImage'));
      setGalleryImages(convertImagesUrlsToImageArr(gallery, 'galleryItem'));
      const catagoriesArr = [
        ...(silverTicketPrice > 0 ? [TicketCategory.Sliver] : []),
        ...(goldenTicketPrice > 0 ? [TicketCategory.Golden] : []),
        ...(platinumTicketPrice > 0 ? [TicketCategory.Platinum] : []),
        ...(vipTicketPrice > 0 ? [TicketCategory.Vip] : []),
      ];
      console.log(catagoriesArr);
      setTicketCatagories(catagoriesArr);
    }
  }, [eventData, modalType]);

  // editor config
  const config = {
    format_tags: 'p;h1;h2;h3;h4;h5;h6',
  };

  const recurringOptions = [
    {
      label: (
        <span className="event-recurring-box">
          <span className="icon">
            <svg
              width="14"
              height="18"
              viewBox="0 0 14 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.83317 16.8135H11.1665C12.087 16.8135 12.8332 16.0673 12.8332 15.1468V7.15865C12.8332 6.93764 12.7454 6.72568 12.5891 6.5694L8.07725 2.05755C7.92097 1.90127 7.70901 1.81348 7.48799 1.81348H2.83317C1.9127 1.81348 1.1665 2.55967 1.1665 3.48014V15.1468C1.1665 16.0673 1.9127 16.8135 2.83317 16.8135Z"
                stroke="#2C272E"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span className="info">
            <span className="title">{L('SingleEvent')}</span>
          </span>
        </span>
      ),
      value: false,
    },
    {
      label: (
        <span className="event-recurring-box">
          <span className="icon">
            <svg
              width="16"
              height="18"
              viewBox="0 0 16 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.66683 5.14681V11.8135C4.66683 12.734 5.41302 13.4801 6.3335 13.4801H11.3335M4.66683 5.14681V3.48014C4.66683 2.55967 5.41302 1.81348 6.3335 1.81348H10.155C10.376 1.81348 10.588 1.90127 10.7442 2.05755L14.4228 5.73607C14.579 5.89235 14.6668 6.10431 14.6668 6.32532V11.8135C14.6668 12.734 13.9206 13.4801 13.0002 13.4801H11.3335M4.66683 5.14681H3.3335C2.22893 5.14681 1.3335 6.04224 1.3335 7.14681V15.1468C1.3335 16.0673 2.07969 16.8135 3.00016 16.8135H9.3335C10.4381 16.8135 11.3335 15.918 11.3335 14.8135V13.4801"
                stroke="#2C272E"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span className="info">
            <span className="title">{L('RecurringEvent')}</span>
          </span>
        </span>
      ),
      value: true,
    },
  ];
  //validate end date
  const validateEndDate = (_1: any, value: number) => {
    const startDate = form.getFieldValue('fromDate');
    if (moment(value).isBefore(moment().add('-1', 'day'))) {
      return Promise.reject(L('EventTimeMustBeAfterTodayDate'));
    }
    if (value !== undefined && value !== null && startDate) {
      if (!moment(value).isSameOrAfter(startDate)) {
        return Promise.reject(L('TheEndTimeMustBeMoreThanEndTime'));
      }
    }
    return Promise.resolve();
  };

  // validate start date
  const validateStartDate = (_1: any, value: number) => {
    const startDate = form.getFieldValue('toDate');
    if (moment(value).isBefore(moment().add('-1', 'day'))) {
      return Promise.reject(L('EventTimeMustBeAfterTodayDate'));
    }
    if (value !== undefined && value !== null && startDate) {
      if (moment(value).isAfter(startDate)) {
        return Promise.reject(L('TheStartTimeMustBeLessThanEndTime'));
      }
    }
    return Promise.resolve();
  };

  // check price values to be more  than 0
  const validatePrice = (_1: any, value: number) => {
    if (value !== undefined && value !== null && value <= 0) {
      return Promise.reject('The card price accepts positive numbers only');
    }
    return Promise.resolve();
  };

  // check price values to be more  than 0
  const validateSeatsNumber = (_1: any, value: number) => {
    if (value !== undefined && value !== null && value < 0 && value > 100) {
      return Promise.reject('The seats accepts positive numbers only');
    }
    return Promise.resolve();
  };

  const handleCancelModal = async () => {
    await form.resetFields();
    onCancel();
  };

  const {
    form,
    current = 0,
    gotoStep,
    stepsProps,
    formProps,
    submit,
  } = useStepsForm({
    async submit(values) {
      const {
        arTitle,
        enTitle,
        categoryId,
        arAbout,
        enAbout,
        arDescription,
        enDescription,
        cityId,
        // buyingMethod,
        placeName,
        mainPicture,
        gallery,
        hideComments,
        totalSeats,
        defaultTicketPrice,
        silverTicketPrice,
        goldenTicketPrice,
        platinumTicketPrice,
        vipTicketPrice,
        isRefundable,
        startDate,
        endDate,
        eventType,
        invitationCode,
        arGoldenTicketDescription,
        arVIPTicketDescription,
        arSilverTicketDescription,
        arPlatinumTicketDescription,
        enGoldenTicketDescription,
        enVIPTicketDescription,
        enSilverTicketDescription,
        fromHour,
        toHour,
        feesType,
        enPlatinumTicketDescription,
        link,
        placeDescription,
      } = values;
      type A = {
        lat: string;
        lng: string;
      };
      const { lat, lng } = placeDescription
        ? (placeDescription as A)
        : { lat: undefined, lng: undefined };
      // let tagsTemp = tags as Array<string>;
      let newTags: Array<string> = [];
      //tagsTemp.map((tag: string) => newTags.push(tag));
      let galleryTemp = gallery as Array<string>;
      let newGallery: Array<string> = [];
      galleryTemp?.map((image: string) => newGallery.push(image));
      const newValues: CreateOrUpdateEventDto = {
        arDescription: arDescription?.toString(),
        enDescription: enDescription?.toString(),
        cityId: cityId ? +cityId?.toString() : undefined,
        latitude: lat ? +lat : undefined,
        longitude: lng ? +lng : undefined,
        arAbout: arAbout?.toString(),
        enAbout: enAbout?.toString(),
        arTitle: arTitle?.toString(),
        enTitle: enTitle?.toString(),
        buyingMethod: 0, //+buyingMethod?.toString(),
        categoryId: +categoryId?.toString(),
        eventType: +eventType?.toString(),
        arGoldenTicketDescription: arGoldenTicketDescription?.toString(),
        arVIPTicketDescription: arVIPTicketDescription?.toString(),
        arSilverTicketDescription: arSilverTicketDescription?.toString(),
        arPlatinumTicketDescription: arPlatinumTicketDescription?.toString(),
        enGoldenTicketDescription: enGoldenTicketDescription?.toString(),
        enVIPTicketDescription: enVIPTicketDescription?.toString(),
        enSilverTicketDescription: enSilverTicketDescription?.toString(),
        enPlatinumTicketDescription: enPlatinumTicketDescription?.toString(),
        placeName: placeName?.toString(),
        silverTicketPrice: silverTicketPrice ? +silverTicketPrice?.toString() : undefined,
        goldenTicketPrice: goldenTicketPrice ? +goldenTicketPrice?.toString() : undefined,
        vipTicketPrice: vipTicketPrice ? +vipTicketPrice?.toString() : undefined,
        platinumTicketPrice: platinumTicketPrice ? +platinumTicketPrice?.toString() : undefined,
        defaultTicketPrice:
          ticketCatagories.length === 0 ? +defaultTicketPrice?.toString() : undefined,
        totalSeats: totalSeats ? +totalSeats?.toString() : undefined,
        invitationCode: invitationCode?.toString(),
        hideComments: Boolean(hideComments?.toString()),
        isRefundable: Boolean(isRefundable?.toString()),
        link: link?.toString(),
        feesType: +feesType?.toString(),

        mainPicture: mainPicture?.toString(),
        organizerId: abp.session.userId,
        toHour: toHour?.toString()
          ? moment(toHour.toString()).format(timingHelper.defaultTimeFormat)
          : undefined,
        fromHour: fromHour?.toString()
          ? moment(fromHour.toString()).format(timingHelper.defaultTimeFormat)
          : undefined,
        startDate: startDate?.toString()
          ? moment(startDate.toString()).format(timingHelper.defaultDateFormat)
          : undefined,
        endDate: endDate?.toString()
          ? moment(endDate.toString()).format(timingHelper.defaultDateFormat)
          : undefined,
        tags: newTags,
        gallery: newGallery,
      };

      const submitData = modalType === 'update' ? { ...newValues, id: eventData!.id } : newValues;
      if (recurringEvent) {
        // set date and time for parent
        submitData.startDate = moment().add(1, 'days').format(timingHelper.defaultDateFormat);
        submitData.endDate = moment().add(20, 'days').format(timingHelper.defaultDateFormat);
        submitData.fromHour = moment().format(timingHelper.defaultTimeFormat);
        submitData.toHour = moment().format(timingHelper.defaultTimeFormat);
      }
      console.log({ schedules });
      let parentID = await onOk(submitData);
      if (recurringEvent) {
        schedules.map(async (s: any) => {
          let data = submitData;
          data.startDate = s[0].startDate;
          data.endDate = s[0].endDate;
          data.toHour = s[0].toHour;
          data.fromHour = s[0].fromHour;
          data.repeat = s[0].repeat;
          data.endAfterEvents = s[0].endAfterEvents;
          data.parentId = parentID;
          if (s.id === undefined) await onOk(data);
        });
      }
      onCancel();
      return 'ok';
    },
    total: 5,
  });

  const getCustomToolbar = (toolbar: any) => {
    const goToBack = (e: any) => {
      e.preventDefault();
      toolbar.onNavigate('PREV');
    };
    const goToNext = (e: any) => {
      e.preventDefault();
      toolbar.onNavigate('NEXT');
    };
    const month = () => {
      const date = moment(toolbar.date);
      let month = date.format('MMMM');

      return <span className="rbc-toolbar-label">{month}</span>;
    };
    const year = () => {
      const date = moment(toolbar.date);
      let year = date.format('YYYY');
      return <span className="rbc-toolbar-label">{year}</span>;
    };
    return (
      <div className="toolbar-container">
        <div className="left-navigation-buttons">
          <button className="btn btn-back" onClick={goToBack}>
            <LeftOutlined className="prev-icon" />
          </button>
          {month()}
          {year()}

          <button className="btn btn-next" onClick={goToNext}>
            <RightOutlined className="next-icon" />
          </button>
        </div>
        <div className="right-navigation-buttons">
          <Button
            type="default"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenScheduleModal(true);
            }}
          >
            {L('AddSchedule')}
          </Button>
        </div>
      </div>
    );
  };

  const formList = [
    <>
      <h3 className="modal-heading">{L('CreateEventHeading')}</h3>
      <p className="modal-desc">{L('CreateEventDesc')}</p>
      <Row>
        <Col md={{ span: 11, offset: 0 }} xs={24}>
          <Form.Item label={L('ArTitle')} name="arTitle" rules={arabicNameRules}>
            <Input type="text" dir="rtl" />
          </Form.Item>
        </Col>
        <Col md={{ span: 11, offset: 2 }} xs={24}>
          <Form.Item label={L('EnTitle')} name="enTitle" rules={englishNameRules}>
            <Input type="text" dir="ltr" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label={L('EventActivity')} name="categoryId" rules={[RULES.required]}>
        <Select placeholder={L('PleaseSelectanActivity')}>
          {eventCategories &&
            eventCategories?.length > 0 &&
            eventCategories?.map((event: any) => (
              <Select.Option key={event.id} value={event.id}>
                {event.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item label={L('EventTags')} name="tags">
        <EditableTags tags={tagsData} setTags={setTagsData} />

        <span className="modal-hint">{L('TagsHint')}</span>
      </Form.Item>
    </>,

    <>
      <h3 className="modal-heading">{L('CreateEventHeading2')}</h3>
      <p className="modal-desc">{L('CreateEventDesc2')}</p>
      <div className="event-types">
        <Form.Item name="eventType" colon={false}>
          <Radio.Group
            options={eventTypesOptions}
            onChange={({ target: { value } }: RadioChangeEvent) => {
              setEventType(value);
            }}
            optionType="button"
          />
        </Form.Item>
      </div>
    </>,
    // <>
    //   <h3 className="modal-heading">{L('CreateEventHeading3-1')}</h3>
    //   <p className="modal-desc">{L('CreateEventDesc3-1')}</p>
    //   {eventType === EventTypes.Online ? (
    //     <>
    //       <Form.Item label={L('EventLink')} name="link" rules={[RULES.required]}>
    //         <Input type="url" />
    //       </Form.Item>
    //       {/* <Form.Item label={L('Price')} name="price" rules={[RULES.required]}>
    //         <Input type="text" />
    //       </Form.Item> */}
    //     </>
    //   ) : (
    //     <>
    //       <Form.Item label={L('VenueLocation')} name="placeDescription" rules={[RULES.required]}>
    //         <small className="map-hint-text">{L('pleaseSelectThePositionFromMap')}</small>
    //         <GoogleMapComp
    //           withClick={false}
    //           centerLatLng={{ lat, lng }}
    //           position={lat && lng ? { lat, lng } : undefined}
    //           handlePointClick={(val: google.maps.LatLngLiteral) => {
    //             form.setFieldsValue({ placeDescription: val });
    //             setLat(val.lat);
    //             setLng(val.lng);
    //           }}
    //         />
    //       </Form.Item>
    //       <Form.Item label={L('Address')} name="placeName" rules={[RULES.required]}>
    //         <Input type="text" />
    //       </Form.Item>
    //       <Form.Item label={L('City')} name="cityId" rules={[RULES.required]}>
    //         <Select>
    //           {cities &&
    //             cities?.length > 0 &&
    //             cities.map((city: LiteEntityDto) => (
    //               <Select.Option key={city.value} value={city.value}>
    //                 {city.text}
    //               </Select.Option>
    //             ))}
    //         </Select>
    //       </Form.Item>
    //     </>
    //   )}

    //   <hr />
    //   <h3 className="modal-heading" style={{ marginTop: 10 }}>
    //     {L('CreateEventHeading3-2')}
    //   </h3>
    //   <p className="modal-desc">{L('CreateEventDesc3-2')}</p>

    //   <Form.Item label={L('eventTime')}>
    //     <Input.Group compact>
    //       <Form.Item
    //         className="start-date-input"
    //         name="fromDate"
    //         rules={[
    //           RULES.required,
    //           {
    //             validator: validateStartDate,
    //           },
    //         ]}
    //       >
    //         <DatePicker showTime placeholder={L('StartTime')} />
    //       </Form.Item>

    //       {/* event end time */}
    //       <Form.Item
    //         className="end-date-input"
    //         name="toDate"
    //         rules={[
    //           RULES.required,
    //           {
    //             validator: validateEndDate,
    //           },
    //         ]}
    //       >
    //         <DatePicker showTime placeholder={L('EndTime')} />
    //       </Form.Item>
    //     </Input.Group>
    //   </Form.Item>
    // </>,
    <>
      {' '}
      {schedule ? (
        <>
          <Calendar
            localizer={localizer}
            events={scheduleData}
            defaultView="month"
            view="month"
            startAccessor="start"
            endAccessor="start"
            defaultDate={new Date()}
            components={{
              // event: getCustomEvent,
              toolbar: getCustomToolbar,
            }}
            style={{ height: 500 }}
          />
        </>
      ) : (
        <>
          <h3 className="modal-heading">{L('CreateEventHeading3-1')}</h3>
          <p className="modal-desc">{L('CreateEventDesc3-1')}</p>
          {eventType === EventTypes.Online ? (
            <>
              <Form.Item label={L('EventLink')} name="link" rules={[RULES.required]}>
                <Input type="url" />
              </Form.Item>
              {/* <Form.Item label={L('Price')} name="price" rules={[RULES.required]}>
          <Input type="text" />
        </Form.Item> */}
            </>
          ) : (
            <>
              <Form.Item
                label={L('VenueLocation')}
                name="placeDescription"
                rules={[RULES.required]}
              >
                <small className="map-hint-text">{L('pleaseSelectThePositionFromMap')}</small>
                <GoogleMapComp
                  withClick={false}
                  centerLatLng={{ lat, lng }}
                  position={lat && lng ? { lat, lng } : undefined}
                  handlePointClick={(val: google.maps.LatLngLiteral) => {
                    form.setFieldsValue({ placeDescription: val });
                    setLat(val.lat);
                    setLng(val.lng);
                  }}
                />
              </Form.Item>
              <Form.Item label={L('Address')} name="placeName" rules={[RULES.required]}>
                <Input type="text" />
              </Form.Item>
              <Form.Item label={L('City')} name="cityId" rules={[RULES.required]}>
                <Select>
                  {cities &&
                    cities?.length > 0 &&
                    cities.map((city: LiteEntityDto) => (
                      <Select.Option key={city.value} value={city.value}>
                        {city.text}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </>
          )}

          <hr />
          <h3 className="modal-heading" style={{ marginTop: 10 }}>
            {L('CreateEventHeading3-2')}
          </h3>
          <p className="modal-desc2">{L('CreateEventDesc3-2')}</p>
          <div className="event-recurring">
            <Form.Item name="recurring" initialValue={recurringEvent}>
              <Radio.Group
                defaultValue={recurringEvent}
                options={recurringOptions}
                onChange={({ target: { value } }: RadioChangeEvent) => {
                  setRecurringEvent(value);
                }}
                optionType="button"
              />
            </Form.Item>
          </div>
          <p className="modal-desc">{L('CreateEventDesc3-3')}</p>
          {!recurringEvent ? (
            <>
              <Form.Item label={L('EventStart')}>
                <Input.Group compact>
                  <Form.Item
                    className="start-date-input"
                    name="startDate"
                    rules={[
                      RULES.required,
                      {
                        validator: validateStartDate,
                      },
                    ]}
                  >
                    <DatePicker placeholder={L('StartDate')} />
                  </Form.Item>

                  {/* event end time */}
                  <Form.Item className="end-date-input" name="fromHour" rules={[RULES.required]}>
                    <TimePicker showSecond={false} placeholder={L('FromTime')} />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
              <Form.Item label={L('EventEnd')}>
                <Input.Group compact>
                  <Form.Item
                    className="start-date-input"
                    name="endDate"
                    rules={[
                      RULES.required,
                      {
                        validator: validateEndDate,
                      },
                    ]}
                  >
                    <DatePicker placeholder={L('EndDate')} />
                  </Form.Item>

                  {/* event end time */}
                  <Form.Item className="end-date-input" name="toHour" rules={[RULES.required]}>
                    <TimePicker showSecond={false} placeholder={L('ToTime')} />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </>
          ) : (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSchedule(true);
                document.querySelector('.scrollable-modal')!.scrollTop = 0;
              }}
            >
              {L('AddSchedule')}
            </Button>
          )}
        </>
      )}
    </>,
    <>
      <h3 className="modal-heading">{L('CreateEventHeading4')}</h3>
      <p className="modal-desc">{L('CreateEventDesc4')}</p>

      {eventType === EventTypes.PayWithSeats ? (
        <Form.Item
          label={L('SeatCount')}
          name="totalSeats"
          rules={[
            RULES.required,
            {
              message: L('PleaseEnterValidSeatsCount'),
              validator: validateSeatsNumber,
            },
          ]}
        >
          <InputNumber type="number" style={{ width: '100%' }} />
        </Form.Item>
      ) : eventType === EventTypes.Private ? (
        <Form.Item label={L('InvitationCode')} name="invitationCode" rules={[RULES.required]}>
          <Input type="text" />
        </Form.Item>
      ) : null}
      <div className="custom-ant-upload">
        <Form.Item label={L('AddCoverImage')} name="mainPicture" rules={[RULES.required]}>
          <span className="hint">{L('EventCoverHint')}</span>
          <EditableImage
            defaultFileList={eventMainImage}
            onSuccess={(url: string) => {
              form.setFieldsValue({ mainPicture: url });
              setEventMainImage(convertImageToImageArr(url, 'mainPicture'));
            }}
            onRemove={() => {
              form.setFieldsValue({ mainPicture: undefined });
              setEventMainImage(convertImageToImageArr(undefined, 'mainPicture'));
            }}
          />
        </Form.Item>
      </div>
      <span className="custom-label">{L('ArDescription')}</span>
      <span className="hint">{L('EventDescHint')}</span>

      <Form.Item colon={false} name="arAbout" rules={arabicNameRules}>
        <Input.TextArea dir="auto" placeholder={L('ArSummary')} rows={4} />
      </Form.Item>
      <Form.Item colon={false} name="arDescription" rules={[RULES.required]}>
        <CKEditor
          initData={arDesc}
          config={{ ...config, contentsLangDirection: 'rtl' }}
          onChange={(event) => {
            setArDesc(event.editor.getData());
            form.setFieldsValue({ arDescription: event.editor.getData() });
          }}
        />
      </Form.Item>
      <span className="custom-label">{L('EnDescription')}</span>

      <span className="hint">{L('EventDescHint')}</span>

      <Form.Item colon={false} name="enAbout" rules={englishNameRules}>
        <Input.TextArea dir="auto" placeholder={L('EnSummary')} rows={4} />
      </Form.Item>

      <Form.Item colon={false} name="enDescription" rules={[RULES.required]}>
        <CKEditor
          initData={enDesc}
          config={{ ...config, contentsLangDirection: 'ltr' }}
          onChange={(event) => {
            setEnDesc(event.editor.getData());
            form.setFieldsValue({ enDescription: event.editor.getData() });
          }}
        />
      </Form.Item>
      <Form.Item label={L('AddEventGallery')} name="gallery">
        <span className="hint">{L('EventGalleryHint')}</span>

        <UploadImage
          defaultFileList={galleryImages}
          currentCount={galleryImages.length}
          onUploadComplete={(fileName: string) => {
            const oldGalleryImages = form.getFieldValue('gallery') ?? [];
            form.setFieldsValue({ gallery: [...oldGalleryImages, fileName] });
            setGalleryImages(
              convertImagesUrlsToImageArr([...oldGalleryImages, fileName], 'galleryItem')
            );
          }}
          onRemoveImage={(fileName: string) => {
            const oldGalleryImages = form.getFieldValue('gallery');
            const newGalleryFiles = oldGalleryImages.filter((file: string) => file !== fileName);
            form.setFieldsValue({ gallery: newGalleryFiles });
            setGalleryImages(convertImagesUrlsToImageArr(newGalleryFiles, 'galleryItem'));
          }}
        >
          <UploadOutlined />
        </UploadImage>
      </Form.Item>
      <Form.Item label={L('hideComments')} name="hideComments">
        <Radio.Group>
          <Radio value={true}>{L('yes')}</Radio>
          <Radio value={false}>{L('No')}</Radio>
        </Radio.Group>
      </Form.Item>
    </>,
    <>
      {/* Buying Method */}
      <Form.Item label={L('BuyingMethod')} name="buyingMethod">
        <Select placeholder={L('PleaseSelectBuyingMethod')} defaultValue={0}>
          <Select.Option value={0}>{L('OnTheApp')}</Select.Option>
          {/* <Select.Option value={1}>{L('InOfficialWebsite')}</Select.Option> */}
        </Select>
      </Form.Item>
      {/* event location */}
      {/* ticket category */}
      <Form.Item label={L('ticketCategory')}>
        <Select
          mode="multiple"
          onChange={(val: number[]) => setTicketCatagories(val)}
          allowClear
          placeholder={L('selectTicketCategory')}
          value={ticketCatagories}
        >
          <Select.Option value={TicketCategory.Golden}>{L('golden')}</Select.Option>
          <Select.Option value={TicketCategory.Sliver}>{L('silver')}</Select.Option>
          <Select.Option value={TicketCategory.Platinum}>{L('platinum')}</Select.Option>
          <Select.Option value={TicketCategory.Vip}>{L('vip')}</Select.Option>
        </Select>
      </Form.Item>
      {ticketCatagories.includes(TicketCategory.Sliver) && (
        <>
          {' '}
          <Form.Item
            label={L('silverTicketPrice')}
            name="silverTicketPrice"
            rules={[
              RULES.required,
              {
                message: L('PleaseEnterValidTicketPrice'),
                validator: validatePrice,
              },
            ]}
          >
            <InputNumber type="number" />
          </Form.Item>
          <Form.Item label={L('EnSilverTicketDesc')} name="enSilverTicketDescription">
            <Input.TextArea dir="auto" rows={4} />
          </Form.Item>
          <Form.Item label={L('ArSilverTicketDesc')} name="arSilverTicketDescription">
            <Input.TextArea dir="auto" rows={4} />
          </Form.Item>
        </>
      )}
      {ticketCatagories.includes(TicketCategory.Golden) && (
        <>
          {' '}
          <Form.Item
            label={L('goldenTicketPrice')}
            name="goldenTicketPrice"
            rules={[
              RULES.required,
              {
                message: L('PleaseEnterValidTicketPrice'),
                validator: validatePrice,
              },
            ]}
          >
            <InputNumber type="number" />
          </Form.Item>
          <Form.Item label={L('EnGoldenTicketDesc')} name="enGoldenTicketDescription">
            <Input.TextArea dir="auto" rows={4} />
          </Form.Item>
          <Form.Item label={L('ArGoldenTicketDesc')} name="arGoldenTicketDescription">
            <Input.TextArea dir="auto" rows={4} />
          </Form.Item>
        </>
      )}
      {ticketCatagories.includes(TicketCategory.Platinum) && (
        <>
          <Form.Item
            label={L('platinumTicketPrice')}
            name="platinumTicketPrice"
            rules={[
              RULES.required,
              {
                message: L('PleaseEnterValidTicketPrice'),
                validator: validatePrice,
              },
            ]}
          >
            <InputNumber type="number" />
          </Form.Item>
          <Form.Item label={L('EnPlatinumTicketDesc')} name="enPlatinumTicketDescription">
            <Input.TextArea dir="auto" rows={4} />
          </Form.Item>
          <Form.Item label={L('ArPlatinumTicketDesc')} name="arPlatinumTicketDescription">
            <Input.TextArea dir="auto" rows={4} />
          </Form.Item>
        </>
      )}
      {ticketCatagories.includes(TicketCategory.Vip) && (
        <>
          {' '}
          <Form.Item
            label={L('vipTicketPrice')}
            name="vipTicketPrice"
            rules={[
              RULES.required,
              {
                message: L('PleaseEnterValidTicketPrice'),
                validator: validatePrice,
              },
            ]}
          >
            <InputNumber type="number" />
          </Form.Item>
          <Form.Item label={L('EnVIPTicketDesc')} name="enVIPTicketDescription">
            <Input.TextArea dir="auto" rows={4} />
          </Form.Item>
          <Form.Item label={L('ArVIPTicketDesc')} name="arVIPTicketDescription">
            <Input.TextArea dir="auto" rows={4} />
          </Form.Item>
        </>
      )}
      {!ticketCatagories || ticketCatagories.length === 0 ? (
        <Form.Item
          label={L('defaultTicketPrice')}
          name="defaultTicketPrice"
          initialValue={eventData ? eventData.price : undefined}
          rules={[
            RULES.required,
            {
              message: L('PleaseEnterValidTicketPrice'),
              validator: validatePrice,
            },
          ]}
        >
          <InputNumber type="number" />
        </Form.Item>
      ) : null}
      {/* ticket Price */}
      {/* ticket type is refundable or not */}
      <Form.Item label={L('TicketFeesOptions')} name="feesType" rules={[RULES.required]}>
        <Radio.Group>
          <Radio value={FeesType.AbsorbFee}>{L('AbsorbFee')}</Radio>
          <Radio value={FeesType.ChargeToCustomer}>{L('ChargeToCustomer')}</Radio>
        </Radio.Group>
      </Form.Item>
      <span className="modal-hint">
        {L('FeesHint1') + ' ' + feesPercentage + '% ' + L('FeesHint2')}
      </span>
      <Form.Item label={L('isRefundable')} name="isRefundable" rules={[RULES.required]}>
        <Radio.Group>
          <Radio value={true}>{L('refundable')}</Radio>
          <Radio value={false}>{L('notRefundable')}</Radio>
        </Radio.Group>
      </Form.Item>
    </>,
  ];

  return (
    <>
      <Modal
        width="95%"
        visible={visible}
        title={modalType === 'create' ? L('CreateEvent') : L('EditEvent')}
        onCancel={handleCancelModal}
        centered
        maskClosable={false}
        destroyOnClose
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={handleCancelModal}>
            {L('Cancel')}
          </Button>,
          <Button
            key="ddd"
            style={{
              margin: !localization.isRTL() ? '0 0 0 8px' : '0 8px 0 0',
              display: current === 0 ? 'none' : 'inline-block',
            }}
            type="default"
            onClick={() => {
              if (current === 2 && schedule) {
                setSchedule(false);
              } else {
                gotoStep(current - 1);
              }
              document.querySelector('.scrollable-modal')!.scrollTop = 0;
            }}
          >
            {!localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
            <span>{L('Back')}</span>
          </Button>,
          <Button
            type="primary"
            key="dd"
            loading={isSubmittingEvent}
            onClick={() => {
              current !== 4 ? gotoStep(current + 1) : submit();
              document.querySelector('.scrollable-modal')!.scrollTop = 0;
            }}
          >
            <span>
              {current === 4 && modalType == 'create'
                ? L('Create')
                : current === 4 && modalType !== 'create'
                ? L('Save')
                : L('SaveAndContinue')}
            </span>
            {localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
          </Button>,
        ]}
      >
        <div className="scrollable-modal">
          {isGettingData ? (
            <div className="loading-comp">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <div className="custom-steps" style={{ display: current === 5 ? 'none' : 'grid' }}>
                <div className="steps-indicators">
                  {' '}
                  <Steps {...stepsProps} direction="vertical" className="steps-wrapper">
                    <Step
                      title={L('CreateEventStep1Title')}
                      description={L('CreateEventStep1Description')}
                    />
                    <Step
                      title={L('CreateEventStep2Title')}
                      description={L('CreateEventStep2Description')}
                    />
                    <Step
                      title={L('CreateEventStep3Title')}
                      description={L('CreateEventStep3Description')}
                    />
                    <Step
                      title={L('CreateEventStep4Title')}
                      description={L('CreateEventStep4Description')}
                    />
                    <Step
                      title={L('CreateEventStep5Title')}
                      description={L('CreateEventStep5Description')}
                    />
                  </Steps>
                </div>

                <div className={!localization.isRTL() ? 'steps-form rtl' : 'steps-form'}>
                  <Form {...layout} {...formProps}>
                    {formList[current]}
                  </Form>
                </div>
              </div>
              {current === 5 && (
                <Result
                  status="success"
                  className="steps-result"
                  title={L('ShopCreatedSuccessfully')}
                  extra={
                    <>
                      <Button
                        type="primary"
                        onClick={() =>
                          setTimeout(() => (window.location.href = '/shop-dashboard'), 500)
                        }
                      >
                        <span>{L('GoToDashboard')}</span>
                        {localization.isRTL() ? (
                          <LeftOutlined
                            style={{
                              color: '#fff',
                              fontWeight: 'bold',
                              position: 'relative',
                              top: '2px',
                            }}
                          />
                        ) : (
                          <RightOutlined
                            style={{
                              color: '#fff',
                              fontWeight: 'bold',
                              position: 'relative',
                              top: '.5px',
                            }}
                          />
                        )}
                      </Button>
                    </>
                  }
                />
              )}
            </>
          )}
        </div>
        <EventScheduleModal
          visible={openScheduleModal}
          onCancel={() => {
            setOpenScheduleModal(false);
          }}
          setScheduleData={setScheduleData}
          scheduleData={scheduleData}
          schedules={schedules}
          setSchedules={setSchedules}
        />
      </Modal>
    </>
  );
};

export default CreateOrUpdateEvent;
