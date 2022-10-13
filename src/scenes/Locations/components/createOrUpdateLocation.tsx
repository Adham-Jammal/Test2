import * as React from 'react';
import { Form, Modal, Button, Input } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import { FormInstance } from 'antd/lib/form';
import LocationStore from '../../../stores/locationStore';
import localization from '../../../lib/localization';
import { LocationType } from '../../../lib/types';

export interface ICreateOrUpdateLocationProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  locationStore?: LocationStore;
  onOk: () => void;
  isSubmittingLocation: boolean;
  formRef: React.RefObject<FormInstance>;
  module: number;
  parentId: number;
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

@inject(Stores.LocationStore)
@observer
class CreateOrUpdateLocation extends React.Component<ICreateOrUpdateLocationProps, any> {
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
    this.props.locationStore!.locationModel = undefined;
  };

  render() {
    const { visible, modalType, module, parentId } = this.props;
    const { locationModel } = this.props.locationStore!;

    return (
      <Modal
        visible={visible}
        title={
          modalType === 'create'
            ? module === LocationType.Country
              ? L('CreateCountry')
              : module === LocationType.City
              ? L('CreateCity')
              : L('CreateNeighbourhood')
            : module === LocationType.Country
            ? L('EditCountry')
            : module === LocationType.City
            ? L('EditCity')
            : L('EditNeighbourhood')
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
            loading={this.props.isSubmittingLocation}
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
              initialValue={locationModel !== undefined ? locationModel.arName : undefined}
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
              initialValue={locationModel !== undefined ? locationModel.enName : undefined}
            >
              <Input onChange={this.onEnChange} />
            </FormItem>
            {parentId !== 0 && (
              <FormItem name="parentId" hidden initialValue={parentId}>
                <Input type="hidden" />
              </FormItem>
            )}
          </>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateLocation;
