import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { AvatarDto, CreateOrUpdateAvatarDto } from '../services/avatars/dto';
import avatarsService from '../services/avatars/avatarsService';

class AvatarStore extends StoreBase {
  @observable avatars: Array<AvatarDto> = [];

  @observable loadingAvatars = true;

  @observable isSubmittingAvatar = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable keyword?: string = undefined;

  @observable totalCount = 0;

  @observable sorting?: string = undefined;

  @observable avatarModel?: AvatarDto = undefined;

  @observable IsActive?: boolean = undefined;

  @action
  async getAvatars() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await avatarsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          IsActive: this.IsActive,
          Sorting: this.sorting,
          keyword: this.keyword,
        });
        this.avatars = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingAvatars = true;
      },
      () => {
        this.loadingAvatars = false;
      }
    );
  }

  @action
  async createAvatar(input: CreateOrUpdateAvatarDto) {
    await this.wrapExecutionAsync(
      async () => {
        await avatarsService.createAvatar(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingAvatar = true;
      },
      () => {
        this.isSubmittingAvatar = false;
      }
    );
  }

  @action
  async updateAvatar(input: CreateOrUpdateAvatarDto) {
    await this.wrapExecutionAsync(
      async () => {
        await avatarsService.updateAvatar(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingAvatar = true;
      },
      () => {
        this.isSubmittingAvatar = false;
      }
    );
  }

  @action
  async getAvatarById(input: EntityDto) {
    const avatar = await avatarsService.getAvatarById(input);
    if (avatar !== undefined) {
      this.avatarModel = avatar;
    }
  }

  @action
  async avatarActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await avatarsService.avatarActivation(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingAvatar = true;
      },
      () => {
        this.isSubmittingAvatar = false;
      }
    );
  }

  @action
  async avatarDeActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await avatarsService.avatarDeactivation(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingAvatar = true;
      },
      () => {
        this.isSubmittingAvatar = false;
      }
    );
  }

  @action
  async avatarDelete(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await avatarsService.avatarDelete(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingAvatar = true;
      },
      () => {
        this.isSubmittingAvatar = false;
      }
    );
  }
}

export default AvatarStore;
