/* eslint-disable */
import * as React from 'react';
import { Button, Checkbox, Form, Input, Card } from 'antd';
import { LockOutlined, RightOutlined, LeftOutlined, MailOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import type H from 'history';
import { FormInstance } from 'antd/lib/form';
import { Link, Redirect } from 'react-router-dom';
import AccountStore from '../../stores/accountStore';
import AuthenticationStore from '../../stores/authenticationStore';
import SessionStore from '../../stores/sessionStore';
import Stores from '../../stores/storeIdentifier';
import rules from './index.validation';
import localization from '../../lib/localization';
import { L } from '../../i18next';
import LogoEn from '../../images/logo-en.svg';
import LogoAr from '../../images/logo-ar.svg';
import './index.less';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';

const FormItem = Form.Item;

export interface ILoginProps {
  authenticationStore?: AuthenticationStore;
  sessionStore?: SessionStore;
  accountStore?: AccountStore;
  history: H.History;
  location: H.Location<any>;
}

@inject(Stores.AuthenticationStore, Stores.SessionStore, Stores.AccountStore)
@observer
class Login extends React.Component<ILoginProps> {
  formRef = React.createRef<FormInstance>();
  forgotPasswordFormRef = React.createRef<FormInstance>();

  state = {
    forgotPasswordModalVisible: false,
  };

  handleSubmit = async (values: any) => {
    const { loginModel } = this.props.authenticationStore!;
    const { location } = this.props;

    await this.props.authenticationStore!.loginAsEventOrganizer(values, location);
    sessionStorage.setItem('rememberMe', loginModel.rememberMe ? '1' : '0');
  };

  public render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    if (this.props.authenticationStore!.isAuthenticated) return <Redirect to={from} />;

    const { loginModel } = this.props.authenticationStore!;
    return (
      <div className="login-wrap">
        <div className="login-inner">
          <div className="logo-wrap">
            <img className="website-logo" src={localization.isRTL() ? LogoAr : LogoEn} alt="logo" />
          </div>

          <Card className="login-card">
            {/* <h3 style={{ textAlign: 'center' }}>{L('WelcomeMessage')}</h3> */}
            <Form className="" onFinish={this.handleSubmit} ref={this.formRef}>
              <FormItem
                name="UserNameOrEmailAddressOrPhoneNumber"
                rules={rules.userNameOrEmailAddress}
              >
                <Input
                  placeholder={L('Email')}
                  autoComplete="off"
                  defaultValue=""
                  prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  size="large"
                />
              </FormItem>

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
              <div className="login-footer">
                <div className="checkbox-wrap">
                  <Checkbox
                    checked={loginModel.rememberMe}
                    onChange={loginModel.toggleRememberMe}
                    style={{ paddingRight: 8 }}
                  />
                  {L('RememberMe')}
                </div>

                <div>
                  <Link
                    to={'#'}
                    onClick={() => {
                      this.setState({ forgotPasswordModalVisible: true });
                    }}
                  >
                    {L('ForgotPassword')}
                  </Link>
                </div>
              </div>
              <Button
                type="primary"
                block
                htmlType="submit"
                loading={this.props.authenticationStore!.isLoggingIn}
              >
                <span style={{ fontWeight: 'bold' }}>{L('LogIn2')}</span>
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
              <div className="register-cta">
                <p>{L('DontHaveEventOrganizerAccount')}</p>
              </div>
              <Button
                type="default"
                block
                onClick={() => (window.location.href = '/user/event-organizer/register')}
              >
                {L('CreateAnAccount')}
              </Button>
            </Form>
          </Card>
          <ForgotPasswordModal
            formRef={this.forgotPasswordFormRef}
            isOpen={this.state.forgotPasswordModalVisible}
            onClose={() =>
              this.setState({
                forgotPasswordModalVisible: false,
              })
            }
          />
        </div>
      </div>
    );
  }
}

export default Login;
