import { LicenseType, VehicleType } from '../../../lib/types';

export interface UpdatePromoterDto {
  id: number;
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
  phoneNumber: string;
}
