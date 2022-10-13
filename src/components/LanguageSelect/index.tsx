/* eslint-disable */
import * as React from 'react';
import './index.less';
import 'famfamfam-flags/dist/sprite/famfamfam-flags.css';
import { Dropdown, Menu } from 'antd';
import Stores from '../../stores/storeIdentifier';
import UserStore from '../../stores/userStore';
import classNames from 'classnames';
import { inject } from 'mobx-react';
import localization from '../../lib/localization';
import i18n from 'i18next';
import { GlobalOutlined } from '@ant-design/icons';
import AuthenticationStore from '../../stores/authenticationStore';

declare var abp: any;

export interface ILanguageSelectProps {
  userStore?: UserStore;
  authenticationStore?: AuthenticationStore;
}

@inject(Stores.UserStore, Stores.AuthenticationStore)
class LanguageSelect extends React.Component<ILanguageSelectProps> {
  async changeLanguage(languageName: string) {
    i18n.changeLanguage(languageName);
    i18n.language = languageName;
    i18n.options.lng = languageName;
    localStorage.setItem('i18nextLng', languageName);
    if (this.props.authenticationStore!.isAuthenticated)
      await this.props.userStore!.changeLanguage(languageName);
    abp.utils.setCookieValue(
      'Abp.Localization.CultureName',
      languageName,
      new Date(new Date().getTime() + 5 * 365 * 86400000), //5 year
      abp.appPath
    );

    window.location.reload();
  }

  render() {
    const langMenu = (
      <Menu className={'menu'} selectedKeys={[localization.getCurrentLanguage()]}>
        {localization.getLanguages().map((item: any) => {
          return (
            <Menu.Item key={item.name} onClick={() => this.changeLanguage(item.name)}>
              <i className={item.icon} />{' '}
              <span className={item.name === 'ar' ? 'ar-font' : 'en-font'}>
                {' '}
                {item.displayName}
              </span>
            </Menu.Item>
          );
        })}
      </Menu>
    );

    return (
      <Dropdown overlay={langMenu} placement="bottomRight">
        <GlobalOutlined
          className={classNames(
            'dropDown',
            i18n.language === 'en' ? 'global-icon' : 'global-icon ar'
          )}
        />
      </Dropdown>
    );
  }
}

export default LanguageSelect;
