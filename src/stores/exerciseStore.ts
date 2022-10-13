import { action, observable } from 'mobx';
import { notifySuccess } from '../lib/notifications';
import { EntityDto } from '../services/dto/entityDto';
import { CreateExercisetDto } from '../services/exercise/dto/createExerciseDto';
import { ExerciseDto } from '../services/exercise/dto/exerciseDto';
import { UpdateExercisetDto } from '../services/exercise/dto/updateExerciseDto';
import exerciseService from '../services/exercise/exerciseService';
import StoreBase from './storeBase';

class ExerciseStore extends StoreBase {
  @observable exercises: Array<ExerciseDto> = [];

  @observable loadingExercises = true;

  @observable isSubmittingExercise = false;

  @observable maxResultCount = 1000;

  @observable skipCount = 0;

  @observable totalCount = 0;

  @observable exerciseModel?: ExerciseDto = undefined;

  @observable keyword?: string = undefined;

  @observable advancedSearchKeyword?: string = undefined;

  @observable statusFilter?: boolean = undefined;

  @observable sorting?: string = undefined;

  @action
  async getAllExercises(activeOnly?: boolean) {
    await this.wrapExecutionAsync(
      async () => {
        const result = await exerciseService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          advancedSearchKeyword: this.advancedSearchKeyword,
          isActive: activeOnly !== undefined ? activeOnly : this.statusFilter,
          sorting: this.sorting,
        });
        this.exercises = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingExercises = true;
      },
      () => {
        this.loadingExercises = false;
      }
    );
  }

  @action
  async createExercise(input: CreateExercisetDto) {
    await this.wrapExecutionAsync(
      async () => {
        await exerciseService.createExercise(input);
        await this.getAllExercises();
        notifySuccess();
      },
      () => {
        this.isSubmittingExercise = true;
      },
      () => {
        this.isSubmittingExercise = false;
      }
    );
  }

  @action
  async updateExercise(input: UpdateExercisetDto) {
    await this.wrapExecutionAsync(
      async () => {
        await exerciseService.updateExercise(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingExercise = true;
      },
      () => {
        this.isSubmittingExercise = false;
      }
    );
  }

  @action
  async getExercise(input: EntityDto) {
    const exercise = await exerciseService.getExercise(input);
    if (exercise !== undefined) {
      this.exerciseModel = {
        id: exercise.id,
        imageUrl: exercise.imageUrl,
        arTitle: exercise.arTitle,
        enTitle: exercise.enTitle,
        title: exercise.title,
        createdBy: exercise.createdBy,
        creationTime: exercise.creationTime,
        arDescription: exercise.arDescription,
        enDescription: exercise.enDescription,
        description: exercise.description,
        creatorUserId: exercise.creatorUserId,
        isActive: exercise.isActive,
        amountOfCalories: exercise.amountOfCalories,
        durationInMinutes: exercise.durationInMinutes,
        sessionsCount: exercise.sessionsCount,
      };
    }
  }

  @action
  async exerciseActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await exerciseService.exerciseActivation(input);
        await this.getAllExercises();
        notifySuccess();
      },
      () => {
        this.loadingExercises = true;
      },
      () => {
        this.loadingExercises = false;
      }
    );
  }

  @action
  async exerciseDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await exerciseService.exerciseDeactivation(input);
        await this.getAllExercises();
        notifySuccess();
      },
      () => {
        this.loadingExercises = true;
      },
      () => {
        this.loadingExercises = false;
      }
    );
  }
}

export default ExerciseStore;
