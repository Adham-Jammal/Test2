/* eslint-disable class-methods-use-this */
import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { CreateNotificationDto, NotificationDto, NotificationPagedResultDto } from './dto';

class NotificationsService {
  public async getAll(input: NotificationPagedResultDto): Promise<PagedResultDto<NotificationDto>> {
    const { skipCount, maxResultCount, Sorting } = input || {};
    const result = await http.get('api/services/app/Notification/GetCreatedByMeNotifications', {
      params: {
        skipCount,
        maxResultCount,
        Sorting,
      },
    });
    return result.data.result;
  }

  public async createNotification(input: CreateNotificationDto): Promise<NotificationDto> {
    const result = await http.post('api/services/app/Notification/CreateNotification', input);
    return result.data;
  }
}

export default new NotificationsService();
