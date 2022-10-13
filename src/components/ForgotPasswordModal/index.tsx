/* eslint-disable */
import * as React from 'react';
import { Component } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Form, Modal, Button, Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import localization from '../../lib/localization';
import { L } from '../../i18next';
import { ForgotPasswordInputDto } from '../../services/account/dto/forgotPassword';
import accountService from '../../services/account/accountService';
import { UserOutlined } from '@ant-design/icons';
import ConfirmForgotPasswordModal from '../ConfirmForgotPasswordModal';
import { Link } from 'react-router-dom';
import { notifySuccess } from '../../lib/notifications';

export interface IForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  formRef: React.RefObject<FormInstance>;
}

class ForgotPasswordModal extends Component<IForgotPasswordModalProps, any> {
  state = {
    isSubmitting: false,
    confirmModalVisible: false,
    alreadyHaveCode: false,
    identity: '',
  };
  confirmForgotPasswordFormRef = React.createRef<FormInstance>();

  handleSubmit = async () => {
    const form = this.props.formRef.current;
    form!.validateFields().then(async (values: any) => {
      const forgotPasswordObj: ForgotPasswordInputDto = {
        usernameOrEmailOrPhone: values.usernameOrEmailOrPhone,
      };

      try {
        this.setState({ isSubmitting: true });
        await accountService.forgotPassword(forgotPasswordObj);
        form!.resetFields();
        notifySuccess(L('CodeSentSuccessfully'));
        this.props.onClose();
        this.setState({ isSubmitting: false, confirmModalVisible: true });
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
      <>
        <Modal
          visible={isOpen}
          title={L('ForgotPasswordModalTitle')}
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
                onChange={(value) => this.setState({ identity: value })}
              />
            </FormItem>
            <Link
              to="#"
              onClick={() => {
                this.setState({
                  confirmModalVisible: true,
                  alreadyHaveCode: true,
                });
              }}
            >
              {L('AlreadyHaveTheCode')}
            </Link>
          </Form>
        </Modal>
        <ConfirmForgotPasswordModal
          alreadyHaveCode={this.state.alreadyHaveCode}
          formRef={this.confirmForgotPasswordFormRef}
          isOpen={this.state.confirmModalVisible}
          onClose={() =>
            this.setState({
              confirmModalVisible: false,
            })
          }
          usernameOrEmailOrPhone={this.state.identity}
        />
      </>
    );
  }
}

export default ForgotPasswordModal;
