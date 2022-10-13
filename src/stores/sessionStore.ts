import { action, observable } from 'mobx';
import { notifySuccess } from '../lib/notifications';
import { EntityDto } from '../services/dto/entityDto';
import { CreateSessiontDto } from '../services/session/dto/createSessionDto';

import { GetCurrentLoginInformations } from '../services/session/dto/getCurrentLoginInformations';
import { SessionDto } from '../services/session/dto/sessionDto';
import { UpdateSessiontDto } from '../services/session/dto/updateSessionDto';
import sessionService from '../services/session/sessionService';
import StoreBase from './storeBase';

class SessionStore extends StoreBase {
  @observable currentLogin: GetCurrentLoginInformations = new GetCurrentLoginInformations();

  @observable sessions: Array<SessionDto> = [];

  @observable loadingSessions = true;

  @observable isSubmittingSession = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable sessionModel?: SessionDto = undefined;

  @observable keyword?: string = undefined;

  @observable advancedSearchKeyword?: string = undefined;

  @observable statusFilter?: number = undefined;

  @observable sorting?: string = undefined;

  @action
  async getCurrentLoginInformations() {
    const result = await sessionService.getCurrentLoginInformations();
    this.currentLogin = result;
  }

  @action
  async getAllSessions() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await sessionService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          advancedSearchKeyword: this.advancedSearchKeyword,
          status: this.statusFilter,
          sorting: this.sorting,
        });
        this.sessions = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingSessions = true;
      },
      () => {
        this.loadingSessions = false;
      }
    );
  }

  @action
  async createSession(input: CreateSessiontDto) {
    await this.wrapExecutionAsync(
      async () => {
        await sessionService.createSession(input);
        await this.getAllSessions();
        notifySuccess();
      },
      () => {
        this.isSubmittingSession = true;
      },
      () => {
        this.isSubmittingSession = false;
      }
    );
  }

  @action
  async updateSession(input: UpdateSessiontDto) {
    await this.wrapExecutionAsync(
      async () => {
        await sessionService.updateSession(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingSession = true;
      },
      () => {
        this.isSubmittingSession = false;
      }
    );
  }

  @action
  async getSession(input: EntityDto) {
    const session = await sessionService.getSession(input);
    if (session !== undefined) {
      this.sessionModel = {
        id: session.id,
        imageUrl: session.imageUrl,
        arTitle: session.arTitle,
        enTitle: session.enTitle,
        title: session.title,
        createdBy: session.createdBy,
        creationTime: session.creationTime,
        arDescription: session.arDescription,
        enDescription: session.enDescription,
        description: session.description,
        creatorUserId: session.creatorUserId,
        lastModificationTime: session.lastModificationTime,
        lastModifierUserId: session.lastModifierUserId,
        modifiedBy: session.modifiedBy,
        exercises: session.exercises,
        isActive: session.isActive,
        amountOfCalories: session.amountOfCalories,
        timeInMinutes: session.timeInMinutes,
      };
    }
  }

  @action
  async sessionActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await sessionService.sessionActivation(input);
        await this.getAllSessions();
        notifySuccess();
      },
      () => {
        this.loadingSessions = true;
      },
      () => {
        this.loadingSessions = false;
      }
    );
  }

  @action
  async sessionDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await sessionService.sessionDeactivation(input);
        await this.getAllSessions();
        notifySuccess();
      },
      () => {
        this.loadingSessions = true;
      },
      () => {
        this.loadingSessions = false;
      }
    );
  }
}

export default SessionStore;
