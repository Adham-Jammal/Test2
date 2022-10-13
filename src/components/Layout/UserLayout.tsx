/* eslint-disable */
import * as React from 'react';
import './UserLayout.less';
import { Route, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import Footer from '../Footer';
import LanguageSelect from '../LanguageSelect';
import { userRouter } from '../Router/router.config';
import utils from '../../utils/utils';
import { L } from '../../i18next';
import ProtectedRoute from '../Router/ProtectedRoute';

class UserLayout extends React.Component<any> {
  render() {
    const {
      location: { pathname },
    } = this.props;

    return (
      <DocumentTitle title={L(utils.getPageTitle(pathname))}>
        <div className="login-page">
          <div className="container">
            <div className="lang">
              <LanguageSelect />
            </div>
            <Switch>
              {userRouter
                .filter((item: any) => !item.isLayout)
                .map((item: any, index: number) =>
                  item.needAuth === true ? (
                    <ProtectedRoute
                      key={index}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                    />
                  ) : (
                    <Route
                      key={index}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                    />
                  )
                )}
            </Switch>
          </div>
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
