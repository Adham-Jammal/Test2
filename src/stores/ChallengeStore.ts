import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { ChallengeDto, CreateOrUpdateChallengeDto } from '../services/challenges/dto';
import challengesService from '../services/challenges/challengesService';

class ChallengeStore extends StoreBase {
  @observable challenges: Array<ChallengeDto> = [];

  @observable loadingChallenges = true;

  @observable isSubmittingChallenge = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable keyword?: string = undefined;

  @observable totalCount = 0;

  @observable sorting?: string = undefined;

  @observable challengeModel?: ChallengeDto = undefined;

  @observable IsActive?: boolean = undefined;
  @observable IsExpired?: boolean = undefined;

  @action
  async getChallenges() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await challengesService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          IsActive: this.IsActive,
          Sorting: this.sorting,
          keyword: this.keyword,
          IsExpired: this.IsExpired,
        });
        this.challenges = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingChallenges = true;
      },
      () => {
        this.loadingChallenges = false;
      }
    );
  }

  @action
  async createChallenge(input: CreateOrUpdateChallengeDto) {
    await this.wrapExecutionAsync(
      async () => {
        await challengesService.createChallenge(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingChallenge = true;
      },
      () => {
        this.isSubmittingChallenge = false;
      }
    );
  }

  @action
  async updateChallenge(input: CreateOrUpdateChallengeDto) {
    await this.wrapExecutionAsync(
      async () => {
        await challengesService.updateChallenge(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingChallenge = true;
      },
      () => {
        this.isSubmittingChallenge = false;
      }
    );
  }

  @action
  async getChallengeById(input: EntityDto) {
    const challenge = await challengesService.getChallengeById(input);
    if (challenge !== undefined) {
      this.challengeModel = challenge;
    }
  }

  @action
  async ChallengeActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await challengesService.challengeActivation(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingChallenge = true;
      },
      () => {
        this.isSubmittingChallenge = false;
      }
    );
  }

  @action
  async ChallengeDeActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await challengesService.challengeDeactivation(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingChallenge = true;
      },
      () => {
        this.isSubmittingChallenge = false;
      }
    );
  }

  @action
  async ChallengeDelete(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await challengesService.challengeDelete(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingChallenge = true;
      },
      () => {
        this.isSubmittingChallenge = false;
      }
    );
  }
}

export default ChallengeStore;
