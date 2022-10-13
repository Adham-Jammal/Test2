/* eslint-disable class-methods-use-this */
import { ChangeLanguagaInput } from './dto/changeLanguageInput';
import { CreateOrUpdateUserInput } from './dto/createOrUpdateUserInput';
import { EntityDto } from '../dto/entityDto';
import { GetAllUserOutput } from './dto/getAllUserOutput';
import { PagedResultDto } from '../dto/pagedResultDto';
import { PagedUserResultRequestDto } from './dto/PagedUserResultRequestDto';
import { GetAllLitePagedFilterRequest } from './dto/getAllLitePagedFilterRequest';
import { UpdateUserInput } from './dto/updateUserInput';
import http from '../httpService';
import { GetAllPermissionsOutput } from '../role/dto/getAllPermissionsOutput';
import { ResetPasswordDto } from './dto/resetPasswordDto';
import { LiteEntityDto } from '../dto/liteEntityDto';

class UserService {
  public async create(createUserInput: CreateOrUpdateUserInput) {
    const result = await http.post('api/services/app/User/Create', createUserInput);
    return result.data.result;
  }

  public async update(updateUserInput: UpdateUserInput) {
    const result = await http.put('api/services/app/User/Update', updateUserInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    const result = await http.delete('api/services/app/User/Delete', { params: entityDto });
    return result.data;
  }

  public async getRoles() {
    const result = await http.get('api/services/app/User/GetRoles');
    return result.data.result.items;
  }

  public async changeLanguage(changeLanguageInput: ChangeLanguagaInput) {
    const result = await http.post('api/services/app/User/ChangeLanguage', changeLanguageInput);
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateUserInput> {
    const result = await http.get('api/services/app/User/Get', { params: entityDto });
    return result.data.result;
  }

  public async getAllLite(
    input: GetAllLitePagedFilterRequest
  ): Promise<PagedResultDto<LiteEntityDto>> {
    const result = await http.get('api/services/app/User/GetAllLite', {
      params: {
        type: input.type,
        maxResultCount: input.maxResultCount,
        skipCount: input.skipCount,
        isActive: input.isActive,
      },
    });
    return result.data.result;
  }

  public async getAll(
    pagedFilterAndSortedRequest: PagedUserResultRequestDto
  ): Promise<PagedResultDto<GetAllUserOutput>> {
    const result = await http.get('api/services/app/User/GetAll', {
      params: pagedFilterAndSortedRequest,
    });
    return result.data.result;
  }

  public async getUserPermissions(
    input: EntityDto
  ): Promise<PagedResultDto<GetAllPermissionsOutput>> {
    const result = await http.get('api/services/app/User/GetUserPermissions', {
      params: { id: input.id },
    });
    return result.data.result;
  }

  public async userActivation(input: EntityDto) {
    const result = await http.put('api/services/app/User/Activate', input);
    return result.data;
  }

  public async userDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/User/DeActivate', input);
    return result.data;
  }

  public async checkIfGrantedPermission(permissionName: string): Promise<boolean> {
    const result = await http.get('api/services/app/User/CheckIfGrantedPermission', {
      params: { permissionName },
    });
    return result.data.result;
  }

  public async resetPassword(input: ResetPasswordDto) {
    const result = await http.post('api/services/app/User/ResetPassword', input);
    return result.data;
  }

  public async resetPasswordForCurrentUser(input: any) {
    console.log(input);
    const result = await http.post('api/services/app/User/ResetPasswordForCuurentUser', null, {
      params: { newPassword: input.newPassword },
    });
    return result.data;
  }
}

export default new UserService();
