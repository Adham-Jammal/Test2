import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import type { NewsDto } from '../services/news/dto/NewsDto';
import NewsService from '../services/news/NewsService';
import type { CreateNewsDto } from '../services/news/dto/createNewsDto';
import type { UpdateNewsDto } from '../services/news/dto/updateNewsDto';

class NewsStore extends StoreBase {
  @observable news: Array<NewsDto> = [];

  @observable loadingNews = true;

  @observable isSubmittingNews = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable newsModel?: NewsDto = undefined;

  @observable isActiveFilter?: boolean = undefined;

  @observable keyword?: string = undefined;

  @observable advancedSearchKeyword?: string = undefined;

  @observable sorting?: string = undefined;

  @action
  async getAllNews(): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        const result = await NewsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          isActive: this.isActiveFilter,
          keyword: this.keyword,
          advancedSearchKeyword: this.advancedSearchKeyword,
          sorting: this.sorting,
        });
        this.news = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingNews = true;
      },
      () => {
        this.loadingNews = false;
      }
    );
  }

  @action
  async createNews(input: CreateNewsDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await NewsService.createNews(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingNews = true;
      },
      () => {
        this.isSubmittingNews = false;
      }
    );
  }

  @action
  async updateNews(input: UpdateNewsDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await NewsService.updateNews(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingNews = true;
      },
      () => {
        this.isSubmittingNews = false;
      }
    );
  }

  @action
  async getNews(input: EntityDto): Promise<void> {
    const news = this.news.find((c) => c.id === input.id);
    if (news !== undefined) {
      this.newsModel = {
        id: news.id,
        sourceLogo: news.sourceLogo,
        imageUrl: news.imageUrl,
        isActive: news.isActive,
        arTitle: news.arTitle,
        enTitle: news.enTitle,
        arDescription: news.arDescription,
        description: news.description,
        enDescription: news.enDescription,
        title: news.title,
        sourceName: news.sourceName,
        tags: news.tags,
        commentsCount: news.commentsCount,
        arSourceName: news.arSourceName,
        enSourceName: news.enSourceName,
        likesCount: news.likesCount,
        savedCount: news.savedCount,
        viewsCount: news.viewsCount,
        cities: news.cities,
        categoryId: news.categoryId,
        fromDate: news.fromDate,
        toDate: news.toDate,
        category: news.category,
        createdBy: news.createdBy,
        creationTime: news.creationTime,
      };
    }
  }

  @action
  async newsActivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await NewsService.newsActivation(input);
        notifySuccess();
      },
      () => {
        this.loadingNews = true;
      },
      () => {
        this.loadingNews = false;
      }
    );
  }

  @action
  async newsDeactivation(input: EntityDto): Promise<void> {
    await this.wrapExecutionAsync(
      async () => {
        await NewsService.newsDeactivation(input);
        notifySuccess();
      },
      () => {
        this.loadingNews = true;
      },
      () => {
        this.loadingNews = false;
      }
    );
  }
}

export default NewsStore;
