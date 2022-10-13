import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { notifySuccess } from '../lib/notifications';
import type { StoryDto, CreateStoryDto, UpdateStoryDto } from '../services/story/dto';
import StoryService from '../services/story/storyService';
import { EntityDto } from '../services/dto/entityDto';

class StoryStore extends StoreBase {
  @observable stories: Array<StoryDto> = [];

  @observable loadingStories = true;

  @observable isSubmittingStory = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable storyModel?: StoryDto = undefined;

  @observable totalCount = 0;

  @observable isActiveFilter?: boolean = undefined;

  @observable keyword?: string = undefined;

  @observable advancedSearchKeyword?: string = undefined;

  @observable sorting?: string = undefined;

  @action
  async getStories() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await StoryService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          IsActive: this.isActiveFilter,
          keyword: this.keyword,
          advancedSearchKeyword: this.advancedSearchKeyword,
          sorting: this.sorting,
        });
        this.stories = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingStories = true;
      },
      () => {
        this.loadingStories = false;
      }
    );
  }

  @action
  async getStory(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        const story = await StoryService.getStory(input);
        if (story !== undefined) {
          this.storyModel = {
            id: story.id,
            imageUrl: story.imageUrl,
            disLikesCount: story.disLikesCount,
            arTitle: story.arTitle,
            isLiked: story.isLiked,
            enTitle: story.enTitle,
            title: story.title,
            createdBy: story.createdBy,
            creationTime: story.creationTime,
            arDescription: story.arDescription,
            enDescription: story.enDescription,
            description: story.description,
            order: story.order,
            isExpired: story.isExpired,
            creatorUserId: story.creatorUserId,
            isActive: story.isActive,
            hours: story.hours,
            likesCount: story.likesCount,
            videoLink: story.videoLink,
            viewsCount: story.viewsCount,
            voiceLink: story.voiceLink,
          };
        }
      },
      () => {
        this.isSubmittingStory = true;
      },
      () => {
        this.isSubmittingStory = false;
      }
    );
  }

  @action
  async createStory(input: CreateStoryDto) {
    await this.wrapExecutionAsync(
      async () => {
        await StoryService.createStory(input);
        await this.getStories();
        notifySuccess();
      },
      () => {
        this.isSubmittingStory = true;
      },
      () => {
        this.isSubmittingStory = false;
      }
    );
  }

  @action
  async updateStory(input: UpdateStoryDto) {
    await this.wrapExecutionAsync(
      async () => {
        await StoryService.updateStory(input);
        await this.getStories();
        notifySuccess();
      },
      () => {
        this.isSubmittingStory = true;
      },
      () => {
        this.isSubmittingStory = false;
      }
    );
  }

  @action
  async activateStory(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await StoryService.activateStory(input);
        await this.getStories();
        notifySuccess();
      },
      () => {
        this.isSubmittingStory = true;
      },
      () => {
        this.isSubmittingStory = false;
      }
    );
  }

  @action
  async deActivateStory(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await StoryService.deActivateStory(input);
        await this.getStories();
        notifySuccess();
      },
      () => {
        this.isSubmittingStory = true;
      },
      () => {
        this.isSubmittingStory = false;
      }
    );
  }

  @action
  async deleteStory(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await StoryService.deleteStory(input);
        await this.getStories();
        notifySuccess();
      },
      () => {
        this.isSubmittingStory = true;
      },
      () => {
        this.isSubmittingStory = false;
      }
    );
  }
}

export default StoryStore;
