/* eslint-disable */
import * as React from 'react';
import { Button, Form, Input, Card, Row, Col, Select } from 'antd';
import {
  LockOutlined,
  RightOutlined,
  LeftOutlined,
  MailOutlined,
  PhoneFilled,
  UserOutlined,
} from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import type H from 'history';
import { FormInstance } from 'antd/lib/form';
import Stores from '../../stores/storeIdentifier';
import rules from './index.validation';
import localization from '../../lib/localization';
import { L } from '../../i18next';
import LogoEn from '../../images/logo-en.svg';
import LogoAr from '../../images/logo-ar.svg';
import './index.less';
import ShopManagerStore from '../../stores/shopmanagerStore';
import AuthenticationStore from '../../stores/authenticationStore';
import LoginModel from '../../models/Login/loginModel';
import { countriesCodes, countyCode } from '../../constants';

const FormItem = Form.Item;

export interface ILoginProps {
  shopManagerStore?: ShopManagerStore;
  authenticationStore?: AuthenticationStore;
  history: H.History;
  location: H.Location<any>;
}

@inject(Stores.ShopManagerStore, Stores.AuthenticationStore)
@observer
class RegisterShopManager extends React.Component<ILoginProps> {
  formRef = React.createRef<FormInstance>();

  handleSubmit = async (values: any) => {
    values.phoneNumber = values.countryCode + values.phoneNumber;
    const { location } = this.props;
    // localStorage.setItem('shop-info', JSON.stringify(values));
    await this.props.shopManagerStore?.registerShopManager(values);
    await this.props.authenticationStore!.loginAsShopManager(
      {
        UserNameOrEmailAddressOrPhoneNumber: values.emailAddress,
        password: values.password,
      } as LoginModel,
      location
    );
    window.location.href = '/user/shop/complete-registeration';
  };

  public render() {
    // const { from } = this.props.location.state || { from: { pathname: '/' } };
    //if (this.props.authenticationStore!.isAuthenticated) return <Redirect to={from} />;

    return (
      <div className="login-wrap">
        <div className="login-inner">
          <div className="logo-wrap">
            <img className="website-logo" src={localization.isRTL() ? LogoAr : LogoEn} alt="logo" />
          </div>

          <Card className="login-card">
            {/* <h3 style={{ textAlign: 'center' }}>{L('CreateAnAccount')}</h3> */}
            {/* <p style={{ textAlign: 'center' }}>{L('RegisterShopSubtext')}</p>{' '} */}
            <Form className="" onFinish={this.handleSubmit} ref={this.formRef}>
            <Row>
              <Col md={{ span: 11, offset: 0 }} xs={24}>
                <FormItem name="name" rules={rules.name}>
                  <Input
                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    size="large"
                    placeholder={L('FirstName')}
                    autoComplete="off"
                    defaultValue=""
                  />
                </FormItem>
              </Col>
              <Col md={{ span: 11, offset: 2 }} xs={24}>
                <FormItem name="surname" rules={rules.name}>
                  <Input
                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    size="large"
                    autoComplete="off"
                    placeholder={L('lastName')}
                    defaultValue=""
                  />
                </FormItem>
              </Col>
            </Row>
              <FormItem name="emailAddress" rules={rules.email}>
                <Input
                  placeholder={L('Email')}
                  autoComplete="off"
                  defaultValue=""
                  prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  size="large"
                />
              </FormItem>
              <Row>
                <Col md={{ span: 9, offset: 0 }} xs={{ span: 9, offset: 0 }}>
                  {' '}
                  <FormItem initialValue={'+966'} name="countryCode">
                    <Select
                      size="large"
                      className="country-code-dropdown"
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children[2].props.children[1].indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        optionA.children[2].props.children[1].localeCompare(
                          optionB.children[2].props.children[1]
                        )
                      }
                      showSearch
                    >
                      {countriesCodes.map((country: countyCode, index: number) => {
                        return (
                          <Select.Option value={country.dial_code} key={index}>
                            <i className={'famfamfam-flags ' + country.code.toLowerCase()} />{' '}
                            <span className="code-opt"> {country.dial_code}</span>
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </Col>
                <Col xs={{ span: 14, offset: 1 }} md={{ span: 14, offset: 1 }}>
                  <FormItem name="phoneNumber" rules={rules.phoneNumber}>
                    <Input
                      placeholder={L('PhoneNumber')}
                      defaultValue=""
                      prefix={<PhoneFilled style={{ color: 'rgba(0,0,0,.25)' }} />}
                      size="large"
                    />
                  </FormItem>
                </Col>
              </Row>
              <FormItem name="password" rules={rules.password}>
                <Input.Password
                  visibilityToggle
                  placeholder={L('Password')}
                  defaultValue=""
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  size="large"
                />
              </FormItem>

              <Button
                type="primary"
                block
                htmlType="submit"
                loading={this.props.shopManagerStore!.isSubmittingShopManager}
              >
                <span style={{ fontWeight: 'bold' }}>{L('CreateAnAccount')}</span>
                {localization.isRTL() ? (
                  <LeftOutlined
                    style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
                  />
                ) : (
                  <RightOutlined
                    style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
                  />
                )}
              </Button>
              <Button
                type="default"
                style={{ marginTop: '15px' }}
                block
                onClick={() => (window.location.href = '/user/shop/login')}
              >
                {L('AlreadyHaveAccount')}
              </Button>
            </Form>
          </Card>
        </div>
      </div>
    );
  }
}

export default RegisterShopManager;
