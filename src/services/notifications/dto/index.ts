export interface CreateNotificationDto {
  forAllClient: boolean;
  titelNotification: string;
  arContent: string;
  enContent: string;
  userIds: Array<number>;
}

export interface NotificationDto {
  id: number;
  creationTime: string;
  senderId: number;
  senderType: string;
  receiverId: number;
  receiverType: string;
  arMessage: string;
  enMessage: string;
}

export interface NotificationPagedResultDto {
  maxResultCount?: number;
  skipCount?: number;
  Sorting?: string;
}

export interface NotificationDataDto {
  id: number;
  creationTime: string;
  senderId: number;
  senderType: string;
  receiverId: number;
  receiverType: string;
  arMessage: string;
  enMessage: string;
}
