/* eslint-disable */
import * as React from 'react';
import { Form, Modal, Button, Input } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import { FormInstance } from 'antd/lib/form';
import localization from '../../../lib/localization';
import IndexStore from '../../../stores/indexStore';
import { IndexType } from '../../../lib/types';

export interface ICreateOrUpdateIndexProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  indexStore?: IndexStore;
  onOk: () => void;
  indexType: IndexType;
  isSubmittingIndex: boolean;
  formRef: React.RefObject<FormInstance>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 6 },
    xl: { span: 6 },
    xxl: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 18 },
    xl: { span: 18 },
    xxl: { span: 18 },
  },
};

@inject(Stores.IndexStore)
@observer
class CreateOrUpdateIndex extends React.Component<ICreateOrUpdateIndexProps, any> {
  state = {
    arName: { value: '', validateStatus: undefined, errorMsg: null },
    enName: { value: '', validateStatus: undefined, errorMsg: null },
  };

  handleSubmit = async () => {
    await this.props.onOk();
  };

  validateArName = (value: string) => {
    let reqex = /^[\u0600-\u06FF0-9\s.\-_()+]+$/;
    if (value !== '' && !reqex.test(value)) {
      return {
        validateStatus: 'warning',
        errorMsg: L('YouAreWritingEnglishSymbols'),
      };
    }
    if (value !== '') {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }

    return {
      validateStatus: 'error',
      errorMsg: L('ThisFieldIsRequired'),
    };
  };

  validateEnName = (value: string) => {
    let reqex = /^[A-Za-z0-9\s.\-_()+]+$/;
    if (value !== '' && !reqex.test(value)) {
      return {
        validateStatus: 'warning',
        errorMsg: L('YouAreWritingArabicSymbols'),
      };
    }
    if (value !== '') {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
    return {
      validateStatus: 'error',
      errorMsg: L('ThisFieldIsRequired'),
    };
  };

  onArChange = (e: any) => {
    let value = e.target.value;
    this.setState({ arName: { ...this.validateArName(value), value } });
  };

  onEnChange = (e: any) => {
    let value = e.target.value;
    this.setState({ enName: { ...this.validateEnName(value), value } });
  };

  handleCancel = () => {
    this.props.onCancel();
    this.props.indexStore!.indexModel = undefined;
  };

  render() {
    const { visible, modalType, indexType } = this.props;
    const { indexModel } = this.props.indexStore!;

    return (
      <Modal
        visible={visible}
        title={
          modalType === 'create'
            ? indexType === IndexType.Bank
              ? L('CreateBank')
              : null
            : indexType === IndexType.Bank
            ? L('EditBank')
            : null
        }
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingIndex}
            onClick={this.handleSubmit}
          >
            {modalType === 'create' ? L('Create') : L('Save')}
          </Button>,
        ]}
      >
        <Form ref={this.props.formRef}>
          <>
            <FormItem
              label={L('ArName')}
              name="arName"
              {...formItemLayout}
              validateStatus={this.state.arName.validateStatus}
              help={this.state.arName.errorMsg}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              initialValue={indexModel !== undefined ? indexModel.arName : undefined}
            >
              <Input onChange={this.onArChange} />
            </FormItem>
            <FormItem
              label={L('EnName')}
              name="enName"
              {...formItemLayout}
              validateStatus={this.state.enName.validateStatus}
              help={this.state.enName.errorMsg}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              initialValue={indexModel !== undefined ? indexModel.enName : undefined}
            >
              <Input onChange={this.onEnChange} />
            </FormItem>
          </>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateIndex;
