/* eslint-disable */
import * as React from 'react';

import { Avatar, Dropdown, FormInstance, Layout, Menu, Tooltip } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { isGranted } from '../../lib/abpUtility';
import LogoEn from '../../images/logo-en.svg';
import LogoAr from '../../images/logo-ar.svg';
import { appRouters } from '../Router/router.config';
import localization from '../../lib/localization';
import { L } from '../../i18next';
import './index.less';
import {
  EditOutlined,
  LockOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { UserType } from '../../lib/types';
import UpdateOrganizerProfileModal from '../UpdateOrganizerProfileModal';
import UpdateShopProfileModal from '../UpdateShopProfileModal';
import ResetPasswordModal from '../ResetPasswordModal';

const { Sider } = Layout;
declare let abp: any;

export interface ISiderMenuProps {
  path: any;
  collapsed: boolean;
  onCollapse: any;
  history: any;
}

const SiderMenu = (props: ISiderMenuProps) => {
  const { collapsed, history, path, onCollapse } = props;
  const [updateShopProfileModal, setUpdateShopProfileModal] = React.useState<boolean>(false);
  const [updateOrganizerProfileModal, setUpdateOrganizerProfileModal] =
    React.useState<boolean>(false);

  const [resetPasswordModalVisible, setSesetPasswordModalVisible] = React.useState<boolean>(false);

  const updateShopProfileFormRef = React.createRef<FormInstance>();
  const updateOrganizerProfileFormRef = React.createRef<FormInstance>();
  const resetPasswordFormRef = React.createRef<FormInstance>();

  const resolveAppLogo = () => {
    if (localization.isRTL()) {
      return LogoAr;
    }
    return LogoEn;
  };

  const handleSelectedSubmenuItem = (path: string) => {
    switch (path) {
      case '/clients':
      case '/admins':
      case '/event-organizers':
      case '/shop-managers':
        return ['users'];

      case '/events':
      case '/event-catagories':
        return ['event'];

      case '/shops':
      case '/products':
      case '/orders':
      case '/coupons':
      case '/categories':
      case '/classifications':
        return ['shops'];

      case '/news':
      case '/news-categories':
        return ['news'];

      case '/exercise':
      case '/exercises-session':
        return ['health'];

      case '/food-categories':
      case '/food-dishes':
      case '/food-recipe':
        return ['food'];

      case '/countries':
      case '/cities':
      case '/neighbourhoods':
        return ['location'];

      case '/avatars':
      case '/questions':
        return ['personality'];

      case '/stories':
      case '/quotes':
        return ['my-life'];

      default:
        return [];
    }
  };
  const userType = +abp.auth.getUserType()!;
  const userName = abp.auth.getUserName()!;
  const userImage = abp.auth.getUserImage()!;
  const userId = abp.auth.getUserId()!;

  const filteredRoutes = appRouters.filter(
    (route: any) =>
      route.roles &&
      route.roles.includes(userType) &&
      !route.isLayout &&
      route.showInMenu &&
      route.baseMenuItem === undefined
  );

  const menu = (
    <Menu style={{ zIndex: 9999999999999999999999 }} mode="inline">
      {userType !== UserType.Admin && (
        <Menu.Item
          icon={<EditOutlined />}
          key="1"
          onClick={() => {
            userType === UserType.EventOrganizer
              ? setUpdateOrganizerProfileModal(true)
              : setUpdateShopProfileModal(true);
          }}
        >
          {L('EditProfile')}
        </Menu.Item>
      )}
      <Menu.Item icon={<LockOutlined />} key="2" onClick={() => setSesetPasswordModalVisible(true)}>
        {L('ResetPassword')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Sider
      trigger={null}
      className={localization.isRTL() ? 'sidebar hide-on-mobile rtl' : 'sidebar hide-on-mobile'}
      width={230}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
    >
      <div className={collapsed ? ' collapsed logo-wrapper' : 'logo-wrapper'}>
        <img src={resolveAppLogo()} alt="mohra logo" />
        {localization.isRTL() ? (
          <MenuUnfoldOutlined
            className={localization.isRTL() ? 'trigger close-sidebar rtl' : 'trigger close-sidebar'}
            onClick={() => {
              document.querySelector('.sidebar')?.classList.remove('show-on-mobile');
              document.querySelector('.sidebar')?.classList.add('hide-on-mobile');
            }}
          />
        ) : (
          <MenuFoldOutlined
            className={localization.isRTL() ? 'trigger close-sidebar rtl' : 'trigger close-sidebar'}
            onClick={() => {
              document.querySelector('.sidebar')?.classList.remove('show-on-mobile');
              document.querySelector('.sidebar')?.classList.add('hide-on-mobile');
            }}
          />
        )}
      </div>

      <Menu
        theme="dark"
        className="sidebar-scrolled-menu"
        mode="inline"
        selectedKeys={[path]}
        defaultOpenKeys={handleSelectedSubmenuItem(path)}
      >
        {filteredRoutes.map((route: any) => {
          const nestedItems = appRouters.filter((item: any) => item.baseMenuItem === route.name);
          if (nestedItems.length === 0) {
            return (
              <Menu.Item
                key={route.path}
                icon={<i className={route.icon}></i>}
                onClick={() => {
                  history.push(route.path);
                  document.querySelector('.sidebar')?.classList.remove('show-on-mobile');
                  document.querySelector('.sidebar')?.classList.add('hide-on-mobile');
                }}
              >
                <span>{L(route.title)}</span>
              </Menu.Item>
            );
          }
          return (
            <SubMenu
              className={
                localization.isRTL()
                  ? 'users-submenu users-submenu-rtl'
                  : 'users-submenu users-submenu-ltr'
              }
              icon={<i className={route.icon} />}
              key={route.name}
              title={<span>{L(route.title)}</span>}
            >
              {nestedItems &&
                nestedItems.map((nestedRoute: any) => {
                  if (nestedRoute.permission && !isGranted(nestedRoute.permission)) return null;

                  return (
                    <Menu.Item
                      key={nestedRoute.path}
                      icon={<i className={nestedRoute.icon} />}
                      onClick={() => {
                        history.push(nestedRoute.path);
                        document.querySelector('.sidebar')?.classList.remove('show-on-mobile');
                        document.querySelector('.sidebar')?.classList.add('hide-on-mobile');
                      }}
                    >
                      <span>{L(nestedRoute.title)}</span>
                    </Menu.Item>
                  );
                })}
            </SubMenu>
          );
        })}
      </Menu>

      <div
        className="user-card"
        style={{ gridTemplateColumns: collapsed ? '1fr' : '50px auto 40px' }}
      >
        <div className="user-image">
          {' '}
          {userImage !== null && userImage !== undefined && userImage !== '' ? (
            <Avatar shape="square" src={userImage} />
          ) : (
            <Avatar shape="square" icon={<UserOutlined />} />
          )}
        </div>
        {!collapsed && (
          <>
            {' '}
            <div>
              <span className="user-name">
                {userName && userName.length > 14 ? userName.substr(0, 14) + '..' : userName}
              </span>
              <span className="user-type">
                {userType === UserType.Admin
                  ? L('Admin')
                  : userType === UserType.ShopManager
                  ? L('ShopManager')
                  : L('EventOrganizer')}
              </span>
            </div>
            <div className="log-out">
              {/* <Tooltip placement="top" title={L('Settings')}> */}
              <Dropdown overlay={menu} placement="topCenter">
                <a onClick={(e) => e.preventDefault()}>
                  <SettingOutlined />
                </a>
              </Dropdown>
              {/* </Tooltip> */}
              <Tooltip placement="top" title={L('Logout')}>
                <Link to="/logout">
                  <LogoutOutlined />
                </Link>
              </Tooltip>
            </div>
          </>
        )}
      </div>
      {userType === UserType.EventOrganizer && (
        <UpdateOrganizerProfileModal
          formRef={updateOrganizerProfileFormRef}
          isOpen={updateOrganizerProfileModal}
          userId={userId}
          onClose={() => {
            setUpdateOrganizerProfileModal(!updateOrganizerProfileModal);
          }}
        />
      )}
      {userType === UserType.ShopManager && (
        <UpdateShopProfileModal
          formRef={updateShopProfileFormRef}
          isOpen={updateShopProfileModal}
          userId={userId}
          onClose={() => {
            setUpdateShopProfileModal(!updateShopProfileModal);
          }}
        />
      )}

      <ResetPasswordModal
        formRef={resetPasswordFormRef}
        isOpen={resetPasswordModalVisible}
        userId={userId}
        userType={userType}
        onClose={() => setSesetPasswordModalVisible(false)}
      />
    </Sider>
  );
};

export default SiderMenu;
