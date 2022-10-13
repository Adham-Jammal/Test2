import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { CreateOrUpdateQuestionDto, QuestionDto } from '../services/questions/dto';
import questionsService from '../services/questions/questionsService';

class QuestionStore extends StoreBase {
  @observable questions: Array<QuestionDto> = [];

  @observable loadingQuestions = true;

  @observable isSubmittingQuestion = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable keyword?: string = undefined;

  @observable totalCount = 0;

  @observable sorting?: string = undefined;

  @observable questionModel?: QuestionDto = undefined;

  @observable IsActive?: boolean = undefined;

  @action
  async getQuestions() {
    await this.wrapExecutionAsync(
      async () => {
        const result = await questionsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          IsActive: this.IsActive,
          Sorting: this.sorting,
          keyword: this.keyword,
        });
        this.questions = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingQuestions = true;
      },
      () => {
        this.loadingQuestions = false;
      }
    );
  }

  @action
  async createQuestion(input: CreateOrUpdateQuestionDto) {
    await this.wrapExecutionAsync(
      async () => {
        await questionsService.createQuestion(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingQuestion = true;
      },
      () => {
        this.isSubmittingQuestion = false;
      }
    );
  }

  @action
  async updateQuestion(input: CreateOrUpdateQuestionDto) {
    await this.wrapExecutionAsync(
      async () => {
        await questionsService.updateQuestion(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingQuestion = true;
      },
      () => {
        this.isSubmittingQuestion = false;
      }
    );
  }

  @action
  async getQuestionById(input: EntityDto) {
    const question = await questionsService.getQuestionById(input);
    if (question !== undefined) {
      this.questionModel = question;
    }
  }

  @action
  async questionActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await questionsService.questionActivation(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingQuestion = true;
      },
      () => {
        this.isSubmittingQuestion = false;
      }
    );
  }

  @action
  async questionDeActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await questionsService.questionDeactivation(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingQuestion = true;
      },
      () => {
        this.isSubmittingQuestion = false;
      }
    );
  }

  @action
  async questionDelete(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await questionsService.questionDelete(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingQuestion = true;
      },
      () => {
        this.isSubmittingQuestion = false;
      }
    );
  }
}

export default QuestionStore;
