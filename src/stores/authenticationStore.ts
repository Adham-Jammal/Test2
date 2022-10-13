import { action, observable } from 'mobx';
import type H from 'history';
import LoginModel from '../models/Login/loginModel';
import tokenAuthService from '../services/tokenAuth/tokenAuthService';
import StoreBase from './storeBase';
import { Modal } from 'antd';
import { L } from '../i18next';
import { UserType } from '../lib/types';

declare let abp: any;

class AuthenticationStore extends StoreBase {
  @observable loginModel: LoginModel = new LoginModel();

  @observable isLoggingIn = false;

  @observable userType: number = 0;
  @observable userName: string = '';

  get isAuthenticated(): boolean {
    if (!abp.session.userId) return false;

    return true;
  }

  @action
  public async login(model: LoginModel, location: H.Location<any>) {
    await this.wrapExecutionAsync(
      async () => {
        const result = await tokenAuthService.authenticate({
          UserNameOrEmailAddressOrPhoneNumber: model.UserNameOrEmailAddressOrPhoneNumber,
          password: model.password,
          rememberClient: model.rememberMe,
        });

        if (result.userType === UserType.Client) {
          Modal.error({
            title: L('LoginFailed'),
            content: L('YouCantLogin'),
          });
          return;
        }

        // if (result.userType === UserType.ShopManager && result.status !== 1) {
        //   Modal.error({
        //     title: L('LoginFailed'),
        //     content: L('TheRelatedShopIsNotActiveAndCanNotLogIn'),
        //   });
        //   return;
        // }

        const tokenExpireDate = model.rememberMe
          ? new Date(new Date().getTime() + 1000 * result.expireInSeconds)
          : undefined;
        abp.auth.setToken(
          result.accessToken,
          tokenExpireDate,
          result.userId,
          result.name,
          result.userType.toString(),
          result.imageUrl,
          result.encryptedAccessToken
        );
        // sessionStorage.setItem('userName', result.name);
        // sessionStorage.setItem('userType', '' + result.userType);

        let finalLocation = '';
        if (result.userType === UserType.EventOrganizer) {
          finalLocation = '/event-dashboard';
        } else if (result.userType === UserType.Admin) {
          finalLocation = '/dashboard';
        } else if (result.userType === UserType.ShopManager) {
          if (result.shopId !== null && result.shopId !== undefined) {
            finalLocation = '/shop-dashboard';
          } else {
            finalLocation = '/user/shop/complete-registeration';
          }
        }
        window.location.href = finalLocation;
      },
      () => {
        this.isLoggingIn = true;
      },
      () => {
        this.isLoggingIn = false;
      }
    );
  }

  @action
  public async loginAsEventOrganizer(model: LoginModel, location: H.Location<any>) {
    await this.wrapExecutionAsync(
      async () => {
        const result = await tokenAuthService.authenticate({
          UserNameOrEmailAddressOrPhoneNumber: model.UserNameOrEmailAddressOrPhoneNumber,
          password: model.password,
          rememberClient: model.rememberMe,
        });

        if (result.userType !== UserType.EventOrganizer) {
          Modal.error({
            title: L('LoginFailed'),
            content: L('YouCantLogin'),
          });
          return;
        }

        const tokenExpireDate = model.rememberMe
          ? new Date(new Date().getTime() + 1000 * result.expireInSeconds)
          : undefined;
        abp.auth.setToken(
          result.accessToken,
          tokenExpireDate,
          result.userId,

          result.name,
          result.userType.toString(),
          result.imageUrl,
          result.encryptedAccessToken
        );

        // sessionStorage.setItem('userName', result.name);
        // sessionStorage.setItem('userType', '' + result.userType);

        const finalLocation = '/event-dashboard';
        window.location.href = finalLocation;
      },
      () => {
        this.isLoggingIn = true;
      },
      () => {
        this.isLoggingIn = false;
      }
    );
  }

  @action
  public async loginAsShopManager(model: LoginModel, location: H.Location<any>) {
    await this.wrapExecutionAsync(
      async () => {
        const result = await tokenAuthService.authenticate({
          UserNameOrEmailAddressOrPhoneNumber: model.UserNameOrEmailAddressOrPhoneNumber,
          password: model.password,
          rememberClient: model.rememberMe,
        });
        if (result.userType !== UserType.ShopManager) {
          Modal.error({
            title: L('LoginFailed'),
            content: L('YouCantLogin'),
          });
          return;
        }
        const tokenExpireDate = model.rememberMe
          ? new Date(new Date().getTime() + 1000 * result.expireInSeconds)
          : undefined;
        abp.auth.setToken(
          result.accessToken,
          tokenExpireDate,
          result.userId,

          result.name,
          result.userType.toString(),
          result.imageUrl,
          result.encryptedAccessToken
        );

        // sessionStorage.setItem('userName', result.name);
        // sessionStorage.setItem('userType', '' + result.userType);
        const finalLocation =
          result.shopId !== null && result.shopId !== undefined
            ? '/shop-dashboard'
            : '/user/shop/complete-registeration';

        window.location.href = finalLocation;
      },
      () => {
        this.isLoggingIn = true;
      },
      () => {
        this.isLoggingIn = false;
      }
    );
  }

  @action
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(';').forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    abp.auth.clearToken();
  }
}
export default AuthenticationStore;
