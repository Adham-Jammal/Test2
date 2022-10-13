/* eslint-disable */

import * as React from 'react';
import { Form, Modal, Button, Input, Col, Row } from 'antd';
import { CKEditor } from 'ckeditor4-react';
import { inject, observer } from 'mobx-react';
import FormItem from 'antd/lib/form/FormItem';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import ExerciseStore from '../../../stores/exerciseStore';
import { arabicNameRules, englishNameRules } from '../../../constants';
import UploadMedia from './uploadMedia';

export interface ICreateOrUpdateExerciseProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: (url: string) => void;
  isSubmittingExercise: boolean;
  formRef: React.RefObject<FormInstance>;
  exerciseStore: ExerciseStore;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 8 },
    xl: { span: 8 },
    xxl: { span: 6 },
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

const config = {
  format_tags: 'p;h1;h2;h3;h4;h5;h6',
};

@inject()
@observer
class CreateOrUpdateExercise extends React.Component<ICreateOrUpdateExerciseProps, any> {
  formRef = React.createRef<FormInstance>();
  state = {
    url: '',
  };
  setURL = (val: string) => {
    this.setState({ url: val });
  };
  arDescriptionEditor = null;

  enDescriptionEditor = null;

  handleSubmit = async () => {
    await this.props.onOk(this.state.url);
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible, modalType } = this.props;
    const { exerciseModel } = this.props.exerciseStore!;

    return (
      <Modal
        width="75%"
        visible={visible}
        title={modalType === 'create' ? L('CreateExercise') : L('EditExercise')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        maskClosable={false}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingExercise}
            onClick={() => this.handleSubmit()}
          >
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
        <Form ref={this.props.formRef}>
          <Row>
            <Col {...colLayout}>
              <FormItem
                label={L('ArName')}
                name="arTitle"
                initialValue={exerciseModel?.arTitle}
                colon={false}
                rules={arabicNameRules}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('EnName')}
                name="enTitle"
                initialValue={exerciseModel?.enTitle}
                {...formItemLayout}
                rules={englishNameRules}
                colon={false}
              >
                <Input type="text" />
              </FormItem>
            </Col>

            <Col {...colLayout}>
              <FormItem
                label={L('AmountOfCalories')}
                name="amountOfCalories"
                initialValue={exerciseModel?.amountOfCalories}
                {...formItemLayout}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('SetTime')}
                name="durationInMinutes"
                initialValue={exerciseModel?.durationInMinutes}
                {...formItemLayout}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('ArDescription')}
                name="arDescription"
                initialValue={exerciseModel?.arDescription}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                {...formItemLayout}
              >
                <CKEditor
                  onInstanceReady={({ editor }) => {
                    this.arDescriptionEditor = editor;
                  }}
                  config={config}
                  initData={exerciseModel?.arDescription}
                  onChange={(event) => {
                    this.props.formRef!.current!.setFieldsValue({
                      arDescription: event.editor.getData(),
                    });
                  }}
                />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('EnDescription')}
                name="enDescription"
                initialValue={exerciseModel?.enDescription}
                {...formItemLayout}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                colon={false}
              >
                <CKEditor
                  onInstanceReady={({ editor }) => {
                    this.enDescriptionEditor = editor;
                  }}
                  config={config}
                  initData={exerciseModel?.enDescription}
                  onChange={(event) => {
                    this.props.formRef!.current!.setFieldsValue({
                      enDescription: event.editor.getData(),
                    });
                  }}
                />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                name="imageUrl"
                label={L('ExerciseMedia')}
                initialValue={exerciseModel ? exerciseModel.imageUrl : undefined}
                {...formItemLayout}
              >
                <UploadMedia setURL={this.setURL} />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateExercise;
