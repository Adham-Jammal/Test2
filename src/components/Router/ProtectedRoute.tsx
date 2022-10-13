/* eslint-disable */
import * as React from 'react';

import { Redirect, Route } from 'react-router-dom';

import { isGranted } from '../../lib/abpUtility';
import { UserType } from '../../lib/types';
import { appRouters } from './router.config';

declare var abp: any;

const ProtectedRoute = ({ path, component: Component, permission, render, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!abp.session.userId)
          return props.location.pathname.indexOf('/user/shop') > -1 ? (
            <Redirect to="/user/shop/login" />
          ) : (
            <Redirect to="/user/login" />
          );

        if (permission && !isGranted(permission)) {
          return <Redirect to="/exception?type=401" />;
        }

        if (props.location.pathname.indexOf('/user/shop/complete-registeration') > -1) {
          return Component ? <Component {...props} /> : render(props);
        }

        const userType = +abp.auth.getUserType()!;
        const filteredRoutes = appRouters.filter(
          (route: any) => route.roles && route.roles.includes(userType)
        );
        let founded = false;
        filteredRoutes.map((route: any) => {
          if (props.location.pathname.indexOf(route.path) > -1) {
            founded = true;
            return;
          }
        });
        if (founded) return Component ? <Component {...props} /> : render(props);
        else {
          return userType === UserType.Admin ? (
            <Redirect to="/dashboard" />
          ) : userType === UserType.ShopManager ? (
            <Redirect to="/shop-dashboard" />
          ) : (
            <Redirect to="/event-dashboard" />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
