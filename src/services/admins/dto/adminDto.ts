import { UserStatus } from '../../../lib/types';
import { GetAllPermissionsOutput } from '../../role/dto/getAllPermissionsOutput';

export interface AdminDto {
  id: number;
  name: string;
  surname: string;
  emailAddress: string;
  status: UserStatus;
  fullName?: string;
  lastLoginTime?: string;
  creationTime?: string;
  permissions?: Array<GetAllPermissionsOutput>;
}
