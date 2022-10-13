/* eslint-disable */
import * as React from 'react';
import { Form, Modal, Button, Input } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import { FormInstance } from 'antd/lib/form';
import LocationStore from '../../../stores/locationStore';
import localization from '../../../lib/localization';
import EditableImage from '../../../components/EditableImage';
import { ImageAttr } from '../../../services/dto/imageAttr';

export interface ICreateOrUpdateCountryProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  locationStore?: LocationStore;
  onOk: () => void;
  isSubmittingLocation: boolean;
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

export interface ICreateOrUpdateLocationState {
  defaultFlagImage: Array<ImageAttr>;
  arName: { value: string; validateStatus?: string; errorMsg: string | null };
  enName: { value: string; validateStatus?: string; errorMsg: string | null };
}
@inject(Stores.LocationStore)
@observer
class CreateOrUpdateCountry extends React.Component<
  ICreateOrUpdateCountryProps,
  ICreateOrUpdateLocationState
> {
  state = {
    arName: { value: '', validateStatus: undefined, errorMsg: null },
    enName: { value: '', validateStatus: undefined, errorMsg: null },
    defaultFlagImage: [],
  };

  handleSubmit = async () => {
    await this.props.onOk();
  };

  componentDidUpdate() {
    const { locationModel } = this.props.locationStore!;

    if (
      this.state.defaultFlagImage.length === 0 &&
      locationModel !== undefined &&
      locationModel.flag !== null
    ) {
      this.setState({
        defaultFlagImage: [
          {
            uid: 1,
            name: `FlagImage.png`,
            status: 'done',
            url: locationModel.flag,
            thumbUrl: locationModel.flag,
          },
        ],
      });
    }

    if (locationModel === undefined && this.state.defaultFlagImage.length > 0) {
      this.setState({ defaultFlagImage: [] });
    }
    if (
      locationModel !== undefined &&
      locationModel.flag !== null &&
      this.state.defaultFlagImage.length > 0 &&
      this.state.defaultFlagImage[0]['url'] !== locationModel.flag
    ) {
      this.setState({ defaultFlagImage: [] });
    }
  }

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
    const { visible, modalType } = this.props;
    const { locationModel } = this.props.locationStore!;

    if (this.props.visible === false && document.getElementById('flag-image') != null)
      document.getElementById('flag-image')!.setAttribute('value', '');

    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateCountry') : L('EditCountry')}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        maskClosable={false}
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
            {modalType === 'create' ? L('Create') : L('Edit')}
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
            <FormItem label={L('Flag')} required colon={false} {...formItemLayout}>
              <img id="flag-image" style={{ display: 'none' }} />

              <EditableImage
                defaultFileList={
                  locationModel !== undefined && locationModel.flag !== null
                    ? this.state.defaultFlagImage
                    : []
                }
                onSuccess={(fileName) => {
                  document.getElementById('flag-image')!.setAttribute('value', fileName);
                }}
              />
            </FormItem>
          </>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateCountry;
