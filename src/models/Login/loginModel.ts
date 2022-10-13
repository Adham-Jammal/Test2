import { observable } from 'mobx';

class LoginModel {
  tenancyName!: string;

  UserNameOrEmailAddressOrPhoneNumber!: string;

  password!: string;

  @observable rememberMe!: boolean;

  @observable showModal!: boolean;

  toggleRememberMe = () => {
    this.rememberMe = !this.rememberMe;
  };

  toggleShowModal = () => {
    this.showModal = !this.showModal;
  };
}

export default LoginModel;
