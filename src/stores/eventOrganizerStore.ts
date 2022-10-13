import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import EventOrganizerService from '../services/eventOrganizer';
import userService from '../services/user/userService';
import { L } from '../i18next';
import {
  CreateEventOrganizerDto,
  EventOrganizerDto,
  CreateOrUpdateEventOrganizerDto,
} from '../services/eventOrganizer/dto';

class EventOrganizerStore extends StoreBase {
  @observable eventOrganizers: Array<EventOrganizerDto> = [];
  @observable eventOrganizersForExpoert: Array<EventOrganizerDto> = [];

  @observable organizerData?: EventOrganizerDto = undefined;

  @observable loadingOrganizers = true;
  @observable loadingEventOrganizersForExport = true;

  @observable isSubmittingOrganizer = false;

  @observable isGettingOrganizerData = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable isActiveFilter?: boolean = undefined;

  @observable keyword?: string = undefined;

  @action
  async getEventOrganizersForExport() {
    await this.wrapExecutionAsync(
      async () => {
        let result = await EventOrganizerService.getAll({
          skipCount: 0,
          maxResultCount: 100000000,
          keyword: this.keyword,
          isActive: this.isActiveFilter,
        });
        this.eventOrganizersForExpoert = result.items;
      },
      () => {
        this.loadingEventOrganizersForExport = true;
      },
      () => {
        this.loadingEventOrganizersForExport = false;
      }
    );
  }

  @action
  async getEventOrganizers(): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        const result = await EventOrganizerService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          isActive: this.isActiveFilter,
        });
        this.eventOrganizers = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingOrganizers = true;
      },
      () => {
        this.loadingOrganizers = false;
      }
    );
  }

  @action
  async CreateEventOrganizer(input: CreateOrUpdateEventOrganizerDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await EventOrganizerService.createEventOrganizer(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingOrganizer = true;
      },
      () => {
        this.isSubmittingOrganizer = false;
      }
    );
  }

  @action
  async updateEventOrganizer(input: CreateOrUpdateEventOrganizerDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await EventOrganizerService.updateEventOrganizer(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingOrganizer = true;
      },
      () => {
        this.isSubmittingOrganizer = false;
      }
    );
  }

  @action
  async getEventOrganizer(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        const result = await EventOrganizerService.getEventOrganizer(input);

        this.organizerData = result;
      },
      () => {
        this.isGettingOrganizerData = true;
      },
      () => {
        this.isGettingOrganizerData = false;
      }
    );
  }

  @action
  async verifyEventOrganizer(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await EventOrganizerService.verifyOrganizer(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingOrganizer = true;
      },
      () => {
        this.isSubmittingOrganizer = false;
      }
    );
  }

  @action
  async organizerActivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await userService.userActivation(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingOrganizer = true;
      },
      () => {
        this.isSubmittingOrganizer = false;
      }
    );
  }

  @action
  async organizerDeactivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await userService.userDeactivation(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingOrganizer = true;
      },
      () => {
        this.isSubmittingOrganizer = false;
      }
    );
  }

  @action
  async eventOrganizerRegister(input: CreateEventOrganizerDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await EventOrganizerService.eventOrganizerRegister(input);
        notifySuccess(L('organizerRegisterSuccess'));
      },
      () => {
        this.isSubmittingOrganizer = true;
      },
      () => {
        this.isSubmittingOrganizer = false;
      }
    );
  }
}

export default EventOrganizerStore;
