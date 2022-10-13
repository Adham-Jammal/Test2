/* eslint-disable */
import * as React from 'react';
import './index.less';
import { Dropdown, Menu } from 'antd';
import Stores from '../../stores/storeIdentifier';
import UserStore from '../../stores/userStore';
import classNames from 'classnames';
import { inject } from 'mobx-react';
import { BellOutlined } from '@ant-design/icons';
import AuthenticationStore from '../../stores/authenticationStore';
import i18n from '../../i18next';

declare var abp: any;

export interface ILanguageSelectProps {
  userStore?: UserStore;
  authenticationStore?: AuthenticationStore;
}

@inject(Stores.UserStore, Stores.AuthenticationStore)
class NotificationMenu extends React.Component<ILanguageSelectProps> {
  render() {
    const notficationsMenu = (
      <Menu className={'notifications-menu'}>
        <Menu.Item key={'1'}>
          <span>Lorem ipsum dolor sit amet consectetur.</span>
        </Menu.Item>
        <Menu.Item key={'2'}>
          <span>Lorem ipsum dolor sit amet consectetur.</span>
        </Menu.Item>
        <Menu.Item key={'3'}>
          <span>Lorem ipsum dolor sit amet consectetur.</span>
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={notficationsMenu} placement="bottomRight">
        <BellOutlined
          className={classNames('dropDown', i18n.language === 'en' ? 'bell-icon' : 'bell-icon ar')}
        />
      </Dropdown>
    );
  }
}

export default NotificationMenu;
