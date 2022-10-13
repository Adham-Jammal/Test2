import BuyingMethodDto from './buyingMethodDto';
import { EventOrganizerDto } from '../../eventOrganizer/dto';
import {
  EventOccoursOptions,
  EventStatus,
  EventTypes,
  FeesType,
  TicketCategory,
} from '../../../lib/types';
import { SimpleClientDto } from '../../clients/dto/simpleClientDto';

export interface SimpleTicketDto {
  number: string;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  clientId: number;
  eventId: number;
  type: TicketCategory;
  date: string;
  bookingId: string;
  scanned: boolean;
  id: number;
}

export interface EventDto {
  id?: number;
  arTitle: string;
  enTitle: string;
  title: string;
  categoryId: number;
  categoryName: string;
  organizerId: number;
  mainPicture: string;
  arDescription: string;
  enDescription: string;
  description: string;
  likesCount: number;
  commentsCount: number;
  ticketsCount: number;
  createdBy: string;
  creatorUserId: number;
  creationTime: string;
  buyingMethod: BuyingMethodDto;
  status: EventStatus;
  hideComments: boolean;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
  latitude: number;
  longitude: number;

  cityId: number;
  placeName: string;
  cityName: string;

  arAbout: string;
  enAbout: string;
  about: string;
  isFeatured: boolean;

  gallery: Array<string>;
  tags: Array<string>;
  tickets: Array<SimpleTicketDto>;
  silverTicketPrice: number;
  goldenTicketPrice: number;
  platinumTicketPrice: number;
  vipTicketPrice: number;
  price: number;
  isRefundable: boolean;
  startDate: string;
  schedules: Array<EventDto>;
  endDate: string;
  fromHour: string;
  feesType: FeesType;
  toHour: string;
  isLiked: boolean;
  clients: Array<SimpleClientDto>;
  organizer: EventOrganizerDto;
  scannedTicketsNum: number;
  eventType: EventTypes;
  invitationCode: string;
  enGoldenTicketDescription: string;
  enSilverTicketDescription: string;
  enPlatinumTicketDescription: string;
  enVIPTicketDescription: string;
  arGoldenTicketDescription: string;
  arSilverTicketDescription: string;
  arPlatinumTicketDescription: string;
  arVIPTicketDescription: string;
  link: string;
  repeat?: EventOccoursOptions;
  parentId?: number;
}
