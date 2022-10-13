/* eslint-disable */
import * as React from 'react';

import { Route, Switch } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import utils from '../../utils/utils';
import { ConfigProvider } from 'antd';
import localization from '../../lib/localization';
import ar_EG from 'antd/lib/locale/ar_EG';
import en_US from 'antd/lib/locale/en_US';

const Router = () => {
  const UserLayout = utils.getRoute('/user').component;
  const AppLayout = utils.getRoute('/').component;

  return (
    <ConfigProvider
      locale={localization.isRTL() ? ar_EG : en_US}
      direction={localization.isRTL() ? 'rtl' : 'ltr'}
    >
      <Switch>
        <ProtectedRoute
          path="/user/shop/complete-registeration"
          render={(props: any) => <UserLayout {...props} />}
        />
        <Route path="/user" render={(props: any) => <UserLayout {...props} />} />

        <ProtectedRoute
          path="/product/:id"
          render={(props: any) => <AppLayout {...props} exact />}
        />
        <ProtectedRoute
          path="/category/:id"
          render={(props: any) => <AppLayout {...props} exact />}
        />
        <ProtectedRoute path="/my-category/:id" render={(props: any) => <AppLayout {...props} />} />

        <ProtectedRoute path="/order/:id" render={(props: any) => <AppLayout {...props} exact />} />
        <ProtectedRoute
          path="/payment/:id"
          render={(props: any) => <AppLayout {...props} exact />}
        />
        <ProtectedRoute path="/" render={(props: any) => <AppLayout {...props} exact />} />
      </Switch>
    </ConfigProvider>
  );
};

export default Router;
