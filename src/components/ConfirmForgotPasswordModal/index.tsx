/* eslint-disable */
import * as React from 'react';
import { Component } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Form, Modal, Button, Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import localization from '../../lib/localization';
import { L } from '../../i18next';
import { notifySuccess } from '../../lib/notifications';
import { ConfirmForgotPasswordInputDto } from '../../services/account/dto/forgotPassword';
import { CodeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import accountService from '../../services/account/accountService';

export interface IResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  formRef: React.RefObject<FormInstance>;
  alreadyHaveCode: boolean;
  usernameOrEmailOrPhone: string;
}

class ConfirmForgotPasswordModal extends Component<IResetPasswordModalProps, any> {
  state = {
    isSubmitting: false,
  };

  handleSubmit = async () => {
    const form = this.props.formRef.current;
    form!.validateFields().then(async (values: any) => {
      const confirmForgotPasswordObj: ConfirmForgotPasswordInputDto = {
        code: values.code,
        newPassword: values.newPassword,
        usernameOrEmailOrPhone: this.props.alreadyHaveCode
          ? this.props.usernameOrEmailOrPhone
          : values.usernameOrEmailOrPhone,
      };

      try {
        this.setState({ isSubmitting: true });
        await accountService.confirmForgotPassword(confirmForgotPasswordObj);
        form!.resetFields();
        this.props.onClose();
        notifySuccess();
        this.setState({ isSubmitting: false });
      } catch {
        this.setState({ isSubmitting: false });
      }
    });
  };

  handleCancel = () => {
    this.props.onClose();
  };

  render() {
    const { isOpen, onClose } = this.props;
    return (
      <Modal
        visible={isOpen}
        title={L('ConfirmForgotPasswordModalTitle')}
        onCancel={onClose}
        centered
        maskClosable={false}
        destroyOnClose
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.state.isSubmitting}
            onClick={this.handleSubmit}
          >
            {L('Confirm')}
          </Button>,
        ]}
      >
        <Form ref={this.props.formRef}>
          {this.props.alreadyHaveCode && (
            <FormItem
              name="usernameOrEmailOrPhone"
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
            >
              <Input
                placeholder={L('UsernameOrEmailOrPhone')}
                autoComplete="off"
                defaultValue=""
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                size="large"
              />
            </FormItem>
          )}
          <FormItem name="code" rules={[{ required: true, message: L('ThisFieldIsRequired') }]}>
            <Input
              placeholder={L('Code')}
              autoComplete="off"
              defaultValue=""
              prefix={<CodeOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              size="large"
            />
          </FormItem>

          <FormItem
            name="newPassword"
            rules={[
              {
                required: true,
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message: L('passwordValidation'),
              },
            ]}
          >
            <Input.Password
              visibilityToggle
              placeholder={L('NewPassword')}
              autoComplete="off"
              defaultValue=""
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              size="large"
            />
          </FormItem>
          <FormItem
            name="confirmNewPassword"
            dependencies={['newPassword']}
            rules={[
              {
                required: true,
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message: L('passwordValidation'),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(L('TheTwoPasswordsThatYouEnteredDoNotMatch')));
                },
              }),
            ]}
          >
            <Input.Password
              visibilityToggle
              placeholder={L('ConfirmNewPassword')}
              autoComplete="off"
              defaultValue=""
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              size="large"
            />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default ConfirmForgotPasswordModal;
