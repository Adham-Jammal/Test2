/* eslint-disable */
import * as React from 'react';
import './index.less';
import { Col, Row } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons';
import LanguageSelect from '../LanguageSelect';
import localization from '../../lib/localization';
import { Link } from 'react-router-dom';
import NotificationMenu from '../NotificationMenu';

export interface IHeaderProps {
  collapsed?: any;
  pageTitle: string;
  toggle?: any;
}

export class Header extends React.Component<IHeaderProps> {
  render() {
    return (
      <Row className={localization.isRTL() ? 'rtl header-container' : 'ltr header-container'}>
        <Col className="first-col">
          {!localization.isRTL() ? (
            this.props.collapsed ? (
              <MenuUnfoldOutlined className="trigger" onClick={this.props.toggle} />
            ) : (
              <MenuFoldOutlined className="trigger" onClick={this.props.toggle} />
            )
          ) : this.props.collapsed ? (
            <MenuFoldOutlined className="trigger" onClick={this.props.toggle} />
          ) : (
            <MenuUnfoldOutlined className="trigger" onClick={this.props.toggle} />
          )}
          <span className="pageTitle">{this.props.pageTitle}</span>
        </Col>
        <Col className="first-col-mobile">
          {localization.isRTL() ? (
            <MenuFoldOutlined
              className="trigger"
              onClick={() => {
                document.querySelector('.sidebar')?.classList.add('show-on-mobile');
                document.querySelector('.sidebar')?.classList.remove('hide-on-mobile');
              }}
            />
          ) : (
            <MenuUnfoldOutlined
              className="trigger"
              onClick={() => {
                document.querySelector('.sidebar')?.classList.add('show-on-mobile');
                document.querySelector('.sidebar')?.classList.remove('hide-on-mobile');
              }}
            />
          )}

          <span className="pageTitle">{this.props.pageTitle}</span>
        </Col>
        <Col style={{ padding: '0px 15px' }} className="second-col">
          <NotificationMenu />
          <LanguageSelect />
          {this.props.collapsed && (
            <div
              className="log-out"
              style={{ margin: localization.isRTL() ? '0 5px 0 0' : '0 0 0 5px' }}
            >
              <Link to="/logout">
                <LogoutOutlined />
              </Link>
            </div>
          )}
        </Col>
      </Row>
    );
  }
}

export default Header;
