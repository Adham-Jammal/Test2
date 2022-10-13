/* eslint-disable */
import * as React from 'react';
import './AppLayout.less';
import { Redirect, Switch } from 'react-router-dom';

import DocumentTitle from 'react-document-title';
import { Layout } from 'antd';
import { inject, observer } from 'mobx-react';
import Footer from '../Footer';
import Header from '../Header';
import ProtectedRoute from '../Router/ProtectedRoute';
import SiderMenu from '../SiderMenu';
import { appRouters } from '../Router/router.config';
import utils from '../../utils/utils';
// import NotFoundRoute from '../Router/NotFoundRoute';
import i18n, { L } from '../../i18next';
import Stores from '../../stores/storeIdentifier';
import { UserType } from '../../lib/types';

const { Content } = Layout;
declare let abp: any;
@inject(Stores.AuthenticationStore, Stores.UserStore)
@observer
class AppLayout extends React.Component<any> {
  state = {
    collapsed: false,
  };

  async componentDidMount() {
    const languageName = i18n.language;
    localStorage.setItem('i18nextLng', i18n.language);

    if (this.props.authenticationStore!.isAuthenticated) {
      await this.props.userStore!.changeLanguage(languageName);
    }
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const {
      history,
      location: { pathname },
    } = this.props;

    const { collapsed } = this.state;
    const userType = +abp.auth.getUserType()!;

    const layout = (
      <Layout style={{ minHeight: '100vh' }}>
        <SiderMenu
          path={this.props.location.pathname}
          onCollapse={() => {}}
          history={history}
          collapsed={collapsed}
        />
        <Layout className="mohra-layout">
          <Layout.Header
            style={{
              background: 'transparent',
              color: '#fff',
              fontWeight: 700,
              minHeight: 52,
              padding: 0,
            }}
          >
            <Header
              collapsed={this.state.collapsed}
              pageTitle={L(utils.getPageTitleForHeader(pathname))}
              toggle={this.toggle}
            />
          </Layout.Header>
          <Content style={{ padding: 25 }}>
            <Switch>
              {appRouters
                .filter((item: any) => !item.isLayout && item.component !== undefined)
                .map((route: any, index: any) => (
                  <ProtectedRoute
                    key={index}
                    path={route.path}
                    component={route.component}
                    permission={route.permission}
                  />
                ))}
              <Redirect
                from="/"
                to={
                  userType === UserType.EventOrganizer
                    ? '/event-dashboard'
                    : userType === UserType.ShopManager
                    ? '/shop-dashboard'
                    : '/dashboard'
                }
              />
            </Switch>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );

    return <DocumentTitle title={L(utils.getPageTitle(pathname))}>{layout}</DocumentTitle>;
  }
}

export default AppLayout;
