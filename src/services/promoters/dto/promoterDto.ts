import { LicenseType, VehicleType } from '../../../lib/types';
import { LiteEntityDto } from '../../locations/dto/liteEntityDto';

export interface PromoterDto {
  id: number;
  phoneNumber: string;
  fullName: string;
  drivingLicenseUrl: string;
  identityUrl: string;
  licenseType: LicenseType;
  passportUrl: string;
  vehicleType: VehicleType;
  residenceExpirationDate: string;
  vehicleName: string;
  vehicleNumber: string;
  isActive: boolean;
  vehicleImageUrl: string;
  shop: LiteEntityDto;
}
