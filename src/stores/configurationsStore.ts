import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { notifySuccess } from '../lib/notifications';
import configuationsService from '../services/configurations/configuationsService';
import { FeesPercentageDto } from '../services/configurations/dto';

class ConfigurationsStore extends StoreBase {
  @observable configurations?: FeesPercentageDto = undefined;
  @observable loadingConfigurations = true;
  @observable isSubmittingConfigurations = false;

  @action
  async getConfigurations() {
    await this.wrapExecutionAsync(
      async () => {
        let result = await configuationsService.getFeesPercentage();
        this.configurations = result;
      },
      () => {
        this.loadingConfigurations = true;
      },
      () => {
        this.loadingConfigurations = false;
      }
    );
  }

  @action
  async updateConfigurations(input: FeesPercentageDto) {
    await this.wrapExecutionAsync(
      async () => {
        await configuationsService.updateFeesPercentage(input);
        notifySuccess();
      },
      () => {
        this.isSubmittingConfigurations = true;
      },
      () => {
        this.isSubmittingConfigurations = false;
      }
    );
  }
}

export default ConfigurationsStore;
