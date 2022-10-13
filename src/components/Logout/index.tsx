import * as React from 'react';

import AuthenticationStore from '../../stores/authenticationStore';
import Stores from '../../stores/storeIdentifier';
import { inject } from 'mobx-react';
import { UserType } from '../../lib/types';

export interface ILogoutProps {
  authenticationStore?: AuthenticationStore;
}
declare let abp: any;

@inject(Stores.AuthenticationStore)
class Logout extends React.Component<ILogoutProps> {
  componentDidMount() {
    const userType = +abp.auth.getUserType()!;
    this.props.authenticationStore!.logout();

    if (userType === UserType.Admin) {
      window.location.href = '/';
    } else if (userType === UserType.EventOrganizer) {
      window.location.href = '/user/event-organizer/login';
    } else if (userType === UserType.ShopManager) {
      window.location.href = '/user/shop/login';
    }
  }

  render() {
    return null;
  }
}

export default Logout;
