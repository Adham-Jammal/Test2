import { action, observable } from 'mobx';

import { CreateOrUpdateUserInput } from '../services/user/dto/createOrUpdateUserInput';
import { EntityDto } from '../services/dto/entityDto';
import { GetRoles } from '../services/user/dto/getRolesOuput';
import { GetUserOutput } from '../services/user/dto/getUserOutput';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedUserResultRequestDto } from '../services/user/dto/PagedUserResultRequestDto';
import { UpdateUserInput } from '../services/user/dto/updateUserInput';
import userService from '../services/user/userService';

class UserStore {
  @observable users!: PagedResultDto<GetUserOutput>;

  @observable editUser!: CreateOrUpdateUserInput;

  @observable roles: GetRoles[] = [];

  @action
  async create(createUserInput: CreateOrUpdateUserInput) {
    const result = await userService.create(createUserInput);
    this.users.items.push(result);
  }

  @action
  async update(updateUserInput: UpdateUserInput) {
    const result = await userService.update(updateUserInput);
    this.users.items = this.users.items.map((x: GetUserOutput) => {
      if (x.id === updateUserInput.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await userService.delete(entityDto);
    this.users.items = this.users.items.filter((x: GetUserOutput) => x.id !== entityDto.id);
  }

  @action
  async getRoles() {
    const result = await userService.getRoles();
    this.roles = result;
  }

  @action
  async get(entityDto: EntityDto) {
    const result = await userService.get(entityDto);
    this.editUser = result;
  }

  @action
  async createUser() {
    this.editUser = {
      userName: '',
      name: '',
      surname: '',
      emailAddress: '',
      isActive: false,
      roleNames: [],
      password: '',
      id: 0,
    };
    this.roles = [];
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    const  result = await userService.getAll(pagedFilterAndSortedRequest);
    this.users = result;
  }

  async changeLanguage(languageName: string) {
    await userService.changeLanguage({ languageName });
  }
}

export default UserStore;
