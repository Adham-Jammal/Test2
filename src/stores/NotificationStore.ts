import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { notifySuccess } from '../lib/notifications';
import { CreateNotificationDto, NotificationDto } from '../services/notifications/dto';
import notificationsService from '../services/notifications/notificationsService';

class NotificationStore extends StoreBase {
  @observable notifications: Array<NotificationDto> = [];

  @observable loadingNotifications = true;

  @observable isSubmittingNotification = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable sorting?: string = undefined;

  @action
  async getNotifications() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await notificationsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          Sorting: this.sorting,
        });
        this.notifications = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingNotifications = true;
      },
      () => {
        this.loadingNotifications = false;
      }
    );
  }

  @action
  async createNotification(input: CreateNotificationDto) {
    await this.wrapExecutionAsync(
      async () => {
        await notificationsService.createNotification(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingNotification = true;
      },
      () => {
        this.isSubmittingNotification = false;
      }
    );
  }
}

export default NotificationStore;
