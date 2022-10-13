import { LicenseType, VehicleType } from '../../../lib/types';

export interface CreatePromoterDto {
  fullName: string;
  drivingLicenseUrl: string;
  identityUrl: string;
  licenseType: LicenseType;
  passportUrl?: string;
  vehicleType: VehicleType;
  residenceExpirationDate?: string;
  vehicleName: string;
  vehicleNumber: string;
  vehicleImageUrl: string;
  shopId: number;
  password: string;
  phoneNumber: string;
}
