import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import userService from '../services/user/userService';
import { PromoterDto } from '../services/promoters/dto/promoterDto';
import promotersService from '../services/promoters/promotersService';
import { CreatePromoterDto } from '../services/promoters/dto/createPromoterDto';
import { UpdatePromoterDto } from '../services/promoters/dto/updatePromoterDto';

class PromoterStore extends StoreBase {
  @observable promoters: Array<PromoterDto> = [];
  @observable loadingPromoters = true;
  @observable isSubmittingPromoter = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable totalCount: number = 0;
  @observable promoterModel?: PromoterDto = undefined;
  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;
  @observable vehicleType?: number = undefined;


  // @observable  filter:{
  //   name?:string;
  //   phoneNumber?:string;
  //   vehicleNumber?:string;
  //   vehicleType?:string;
  //   activation?:boolean;
  // }={
  //   name:undefined,
  //   phoneNumber:undefined,
  //   vehicleNumber:undefined,
  //   vehicleType:undefined,
  //   activation:undefined,
  // };
  @action
  async getPromoters() {
    await this.wrapExecutionAsync(async () => {
      let result = await promotersService.getAll({
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
        isActive:this.isActiveFilter,
        keyword:this.keyword,
        vehicleType:this.vehicleType
      });
      this.promoters = result.items;
      this.totalCount = result.totalCount;

    }, () => {
      this.loadingPromoters = true;
    }, () => {
      this.loadingPromoters = false;
    });
  }

  @action
  async createPromoter (input: CreatePromoterDto) {
    await this.wrapExecutionAsync(async () => {
      await promotersService.createPromoter(input);
      await this.getPromoters();
      notifySuccess();
    }, () => {
      this.isSubmittingPromoter = true;
    }, () => {
      this.isSubmittingPromoter = false;
    });
  }

  @action
  async updatePromoter(input: UpdatePromoterDto) {
    await this.wrapExecutionAsync(async () => {
      await promotersService.updatePromoter(input);
      await this.getPromoters();
      notifySuccess();
    }, () => {
      this.isSubmittingPromoter = true;
    }, () => {
      this.isSubmittingPromoter = false;
    });
  }


  @action
  async getPromoter(input: EntityDto) {
    let promoter = this.promoters.find(c => c.id === input.id);
    if (promoter !== undefined) {
      this.promoterModel = {
        id: promoter.id,
        drivingLicenseUrl:promoter.drivingLicenseUrl,
        fullName:promoter.fullName,
        identityUrl:promoter.identityUrl,
        licenseType:promoter.licenseType,
        passportUrl:promoter.passportUrl,
        phoneNumber:promoter.phoneNumber,
        residenceExpirationDate:promoter.residenceExpirationDate,
        shop:promoter.shop,
        vehicleImageUrl:promoter.vehicleImageUrl,
        vehicleName:promoter.vehicleName,
        vehicleNumber:promoter.vehicleNumber,
        vehicleType:promoter.vehicleType,
        isActive:promoter.isActive
      };
    }
  }
  @action
  async promoterActivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await userService.userActivation(input);
      await this.getPromoters();
      notifySuccess();
    }, () => {
      this.loadingPromoters = true;
    }, () => {
      this.loadingPromoters = false;
    });
  }
  @action
  async promoterDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await userService.userDeactivation(input);
      await this.getPromoters();
      notifySuccess();
    }, () => {
      this.loadingPromoters = true;
    }, () => {
      this.loadingPromoters = false;
    });
  }

}

export default PromoterStore;
