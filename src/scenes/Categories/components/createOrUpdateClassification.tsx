/* eslint-disable */
import * as React from 'react';
import { Form, Modal, Button, Input, Col, Row } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import localization from '../../../lib/localization';
import EditableImage from '../../../components/EditableImage';
import { FormInstance } from 'antd/lib/form';
import ClassificationStore from '../../../stores/classificationStore';

export interface ICreateOrUpdateClassificationProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  classificationStore?: ClassificationStore;
  onOk: () => void;
  isSubmittingClassification: boolean;
  formRef: React.RefObject<FormInstance>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 8 },
    xl: { span: 8 },
    xxl: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 16 },
    xl: { span: 16 },
    xxl: { span: 16 },
  },
};

const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },
};

@inject(Stores.ClassificationStore)
@observer
class CreateOrUpdateClassification extends React.Component<
  ICreateOrUpdateClassificationProps,
  any
> {
  formRef = React.createRef<FormInstance>();

  state = {
    arName: { value: '', validateStatus: undefined, errorMsg: null },
    enName: { value: '', validateStatus: undefined, errorMsg: null },
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

  handleSubmit = async () => {
    await this.props.onOk();
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible, onCancel, modalType } = this.props;
    const { classificationModel } = this.props.classificationStore!;

    if (this.props.visible === false && document.getElementById('classification-image') != null)
      document.getElementById('classification-image')!.setAttribute('value', '');

    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateClassification') : L('EditClassification')}
        onCancel={onCancel}
        centered
        destroyOnClose
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingClassification}
            onClick={this.handleSubmit}
          >
            {modalType === 'create' ? L('Create') : L('Save')}
          </Button>,
        ]}
      >
        <Form ref={this.props.formRef}>
          <Row>
            <Col {...colLayout}>
              <FormItem
                label={L('ArName')}
                initialValue={
                  classificationModel !== undefined && classificationModel.arName
                    ? classificationModel.arName
                    : undefined
                }
                name="arName"
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                validateStatus={this.state.arName.validateStatus}
                help={this.state.arName.errorMsg}
                {...formItemLayout}
              >
                <Input type="text" onChange={this.onArChange} onLoad={this.onArChange} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('EnName')}
                name="enName"
                {...formItemLayout}
                initialValue={
                  classificationModel !== undefined && classificationModel.enName
                    ? classificationModel.enName
                    : undefined
                }
                validateStatus={this.state.enName.validateStatus}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                help={this.state.enName.errorMsg}
              >
                <Input type="text" onChange={this.onEnChange} onLoad={this.onEnChange} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label={L('Image')} required {...formItemLayout}>
                <img id="classification-image" style={{ display: 'none' }} />
                <EditableImage
                  //   imageSrc={ classificationModel !== undefined && classificationModel.imageUrl ? classificationModel.imageUrl : undefined}
                  //  prefaredDimensionsMessage={''}
                  onSuccess={(fileName) => {
                    document
                      .getElementById('classification-image')!
                      .setAttribute('value', fileName);
                  }}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateClassification;
