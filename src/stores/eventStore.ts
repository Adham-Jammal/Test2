import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { EventDto } from '../services/events/dto/eventDto';
import eventsService from '../services/events/eventsService';
import { CreateOrUpdateEventDto } from '../services/events/dto/createOrUpdateEventDto';
import { EventOrderDto } from '../services/events/dto/updateEventOrdersDto';
import { EventType } from '../lib/types';
import { EventsPagedFilterRequest } from '../services/events/dto/eventsPagedFilterRequest';

class EventStore extends StoreBase {
  @observable events: Array<EventDto> = [];
  @observable runningEvents: Array<EventDto> = [];
  @observable expiredEvents: Array<EventDto> = [];
  @observable schedules: Array<EventDto> = [];

  @observable loadingSchedules = true;

  @observable loadingEvents = true;
  @observable loadingRunningEvents = true;
  @observable loadingExpiredEvents = true;

  @observable isSubmittingEvent = false;

  @observable isGettingEventData = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable eventModel?: EventDto = undefined;
  @observable selectedEvent?: EventDto = undefined;

  @observable statusFilter?: number = undefined;

  @observable categoryFilter?: number = undefined;

  @observable isSortingItems = false;

  @observable eventType?: EventType = undefined;

  @observable keyword?: string = undefined;

  @observable sorting?: string = undefined;

  @observable onlyMyEvents?: boolean = false;
  @observable running?: boolean = undefined;

  @observable expired?: boolean = undefined;
  @observable expiredTotalCount = 0;
  @observable runningTotalCount = 0;
  @observable schedulesTotalCount = 0;

  @action
  async getEvents() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await eventsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          type: this.eventType,
          keyword: this.keyword,
          status: this.statusFilter,
          categoryId: this.categoryFilter,
          Sorting: this.sorting,
          OnlyMyEvents: this.onlyMyEvents,
          running: this.running,
          expired: this.expired,
          parentId: 0,
        });

        this.events = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingEvents = true;
      },
      () => {
        this.loadingEvents = false;
      }
    );
  }

  @action
  async getRunningEvents() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await eventsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          type: this.eventType,
          keyword: this.keyword,
          status: this.statusFilter,
          categoryId: this.categoryFilter,
          Sorting: this.sorting,
          OnlyMyEvents: this.onlyMyEvents,
          running: this.running,
          expired: this.expired,
        });

        this.runningEvents = result.items;
        this.runningTotalCount = result.totalCount;
      },
      () => {
        this.loadingRunningEvents = true;
      },
      () => {
        this.loadingRunningEvents = false;
      }
    );
  }

  @action
  async getExpiredEvents() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await eventsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          type: this.eventType,
          keyword: this.keyword,
          status: this.statusFilter,
          categoryId: this.categoryFilter,
          Sorting: this.sorting,
          OnlyMyEvents: this.onlyMyEvents,
          running: this.running,
          expired: this.expired,
        });

        this.expiredEvents = result.items;
        this.expiredTotalCount = result.totalCount;
      },
      () => {
        this.loadingExpiredEvents = true;
      },
      () => {
        this.loadingExpiredEvents = false;
      }
    );
  }

  @action
  async getSchedules(input: EventsPagedFilterRequest) {
    await this.wrapExecutionAsync(
      async () => {
        const result = await eventsService.getSchedules({
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount,
          parentId: input.parentId,
        });

        this.schedules = result.items;
        this.schedulesTotalCount = result.totalCount;
      },
      () => {
        this.loadingSchedules = true;
      },
      () => {
        this.loadingSchedules = false;
      }
    );
  }
  @action
  async createEvent(input: CreateOrUpdateEventDto) {
    await this.wrapExecutionAsync(
      async () => {
        let event = await eventsService.createEvent(input);
        await this.getEvents();
        notifySuccess();
        this.selectedEvent = event;
      },
      () => {
        this.isSubmittingEvent = true;
      },
      () => {
        this.isSubmittingEvent = false;
      }
    );
  }

  @action
  async updateEvent(input: CreateOrUpdateEventDto) {
    await this.wrapExecutionAsync(
      async () => {
        let event = await eventsService.updateEvent(input);
        notifySuccess();
        this.selectedEvent = event;
      },
      () => {
        this.isSubmittingEvent = true;
      },
      () => {
        this.isSubmittingEvent = false;
      }
    );
  }

  @action
  async getEvent(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        const event = await eventsService.getEvent(input);
        if (event !== undefined) {
          this.eventModel = {
            id: event.id,
            title: event.title,
            status: event.status,
            arTitle: event.arTitle,
            enTitle: event.enTitle,
            createdBy: event.createdBy,
            creationTime: event.creationTime,
            schedules: event.schedules,
            buyingMethod: event.buyingMethod,
            categoryId: event.categoryId,
            cityId: event.cityId,
            parentId: event.parentId,
            mainPicture: event.mainPicture,
            gallery: event.gallery,
            arAbout: event.arAbout,
            enAbout: event.enAbout,
            tags: event.tags,
            hideComments: event.hideComments,
            arDescription: event.arDescription,
            enDescription: event.enDescription,
            isRefundable: event.isRefundable,
            startDate: event.startDate,
            endDate: event.endDate,
            fromHour: event.fromHour,
            toHour: event.toHour,
            placeName: event.placeName,
            totalSeats: event.totalSeats,
            feesType: event.feesType,
            silverTicketPrice: event.silverTicketPrice,
            goldenTicketPrice: event.goldenTicketPrice,
            platinumTicketPrice: event.platinumTicketPrice,
            vipTicketPrice: event.vipTicketPrice,
            latitude: event.latitude,
            longitude: event.longitude,
            categoryName: event.categoryName,
            commentsCount: event.commentsCount,
            likesCount: event.likesCount,
            description: event.description,
            cityName: event.cityName,
            about: event.about,
            bookedSeats: event.bookedSeats,
            price: event.price,
            tickets: event.tickets,
            organizerId: event.organizerId,
            organizer: event.organizer,
            availableSeats: event.availableSeats,
            clients: event.clients,
            creatorUserId: event.creatorUserId,
            eventType: event.eventType,
            invitationCode: event.invitationCode,
            isFeatured: event.isFeatured,
            isLiked: event.isLiked,
            link: event.link,
            scannedTicketsNum: event.scannedTicketsNum,
            ticketsCount: event.ticketsCount,
            arGoldenTicketDescription: event.arGoldenTicketDescription,
            arPlatinumTicketDescription: event.arPlatinumTicketDescription,
            arSilverTicketDescription: event.arSilverTicketDescription,
            arVIPTicketDescription: event.arVIPTicketDescription,
            enGoldenTicketDescription: event.enGoldenTicketDescription,
            enPlatinumTicketDescription: event.enPlatinumTicketDescription,
            enSilverTicketDescription: event.enSilverTicketDescription,
            enVIPTicketDescription: event.enVIPTicketDescription,
          };
        }
      },
      () => {
        this.isGettingEventData = true;
      },
      () => {
        this.isGettingEventData = false;
      }
    );
  }

  @action
  async updateEventOrders(input: EventOrderDto[]) {
    await this.wrapExecutionAsync(
      async () => {
        await eventsService.updateEventOrders(input);
        notifySuccess();
      },
      () => {
        this.isSortingItems = true;
      },
      () => {
        this.isSortingItems = false;
      }
    );
  }

  @action
  async eventActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await eventsService.eventActivation(input);
        await this.getEvents();
        notifySuccess();
      },
      () => {
        this.loadingEvents = true;
      },
      () => {
        this.loadingEvents = false;
      }
    );
  }

  @action
  async eventDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await eventsService.eventDeactivation(input);
        await this.getEvents();
        notifySuccess();
      },
      () => {
        this.loadingEvents = true;
      },
      () => {
        this.loadingEvents = false;
      }
    );
  }

  @action
  async eventDelete(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await eventsService.deleteEvent(input);
        notifySuccess();
      },
      () => {
        this.loadingEvents = true;
      },
      () => {
        this.loadingEvents = false;
      }
    );
  }
}
export default EventStore;
