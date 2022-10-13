/* eslint-disable */

import * as React from 'react';
import { Form, Modal, Button, Input, Col, Row, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import FormItem from 'antd/lib/form/FormItem';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import EditableImage from '../../../components/EditableImage';
import { CKEditor } from 'ckeditor4-react';
import SessionStore from '../../../stores/sessionStore';
import Stores from '../../../stores/storeIdentifier';
import { ImageAttr } from '../../../services/dto/imageAttr';
import ExerciseStore from '../../../stores/exerciseStore';
import { ExerciseDto } from '../../../services/exercise/dto/exerciseDto';
// import { ImageAttr } from '../../../services/dto/imageAttr';

export interface ICreateOrUpdateSessionProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: (editors: any) => void;
  isSubmittingExercise: boolean;
  formRef: React.RefObject<FormInstance>;
  sessionStore?: SessionStore;
  exerciseStore?: ExerciseStore;
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

const config = {
  format_tags: 'p;h1;h2;h3;h4;h5;h6',
};

export interface ICreateOrUpdateSessionState {
  arTitle: { value: string; validateStatus?: string; errorMsg: string | null };
  enTitle: { value: string; validateStatus?: string; errorMsg: string | null };
  arDescription: string | undefined;
  enDescription: string | undefined;
  defaultImage: Array<ImageAttr>;
  exercises: Array<ExerciseDto>;
}

@inject(Stores.SessionStore)
@observer
class CreateOrUpdateSession extends React.Component<
  ICreateOrUpdateSessionProps,
  ICreateOrUpdateSessionState
> {
  formRef = React.createRef<FormInstance>();

  arDescriptionEditor = null;

  enDescriptionEditor = null;

  state = {
    arTitle: { value: '', validateStatus: undefined, errorMsg: null },
    enTitle: { value: '', validateStatus: undefined, errorMsg: null },
    arDescription: undefined,
    enDescription: undefined,
    defaultImage: [],
    exercises: [],
  };

  async componentDidMount() {
    await this.props.exerciseStore!.getAllExercises(true);
  }

  async componentDidUpdate() {
    const { sessionModel } = this.props.sessionStore!;

    if (
      this.state.defaultImage.length === 0 &&
      sessionModel !== undefined &&
      sessionModel.imageUrl !== null
    ) {
      this.setState({
        defaultImage: [
          {
            uid: 1,
            name: `newsImage.png`,
            status: 'done',
            url: sessionModel.imageUrl,
            thumbUrl: sessionModel.imageUrl,
          },
        ],
        arDescription: sessionModel.arDescription,
        enDescription: sessionModel.enDescription,
      });
    }
  }

  validatearTitle = (value: string) => {
    const reqex = /^[\u0600-\u06FF0-9\s.\-_()+]+$/;
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

  validateenTitle = (value: string) => {
    const reqex = /^[A-Za-z0-9\s.\-_()+]+$/;
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
    const { value } = e.target;
    this.setState({ arTitle: { ...this.validatearTitle(value), value } });
  };

  onEnChange = (e: any) => {
    const { value } = e.target;
    this.setState({ enTitle: { ...this.validateenTitle(value), value } });
  };

  handleSubmit = async (editors: any) => {
    await this.props.onOk(editors);
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible, modalType } = this.props;
    const { sessionModel } = this.props.sessionStore!;
    const { exercises } = this.props.exerciseStore!;

    if (this.props.visible === false && document.getElementById('session-image') != null) {
      document.getElementById('session-image')!.setAttribute('value', '');
    }

    return (
      <Modal
        width="70%"
        visible={visible}
        title={modalType === 'create' ? L('AddSession') : L('EditSession')}
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
            onClick={() =>
              this.handleSubmit({
                arEditor: this.arDescriptionEditor,
                enEditor: this.enDescriptionEditor,
              })
            }
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
                colon={false}
                initialValue={sessionModel?.arTitle}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                validateStatus={this.state.arTitle.validateStatus}
                help={this.state.arTitle.errorMsg}
                {...formItemLayout}
              >
                <Input type="text" onChange={this.onArChange} onLoad={this.onArChange} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('EnName')}
                name="enTitle"
                {...formItemLayout}
                initialValue={sessionModel?.enTitle}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                colon={false}
                validateStatus={this.state.enTitle.validateStatus}
                help={this.state.enTitle.errorMsg}
              >
                <Input type="text" onChange={this.onEnChange} onLoad={this.onEnChange} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('Exercises')}
                name="exercises"
                {...formItemLayout}
                initialValue={sessionModel?.exercises.map((exercise) => exercise.id)}
                // rules={[{ message: L('ThisFieldIsRequired') }]}
                colon={false}
              >
                <Select
                  mode="multiple"
                  placeholder={L('PleaseSelectExercise')}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                    option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {exercises.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.title}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('IsActive')}
                name="isActive"
                initialValue={sessionModel?.isActive}
                {...formItemLayout}
              >
                <Select placeholder={L('PleaseSelectStatus')}>
                  <Select.Option value={true}>Active</Select.Option>
                  <Select.Option value={false}>InActive</Select.Option>
                </Select>
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('SessionTime')}
                name="timeInMinutes"
                initialValue={sessionModel?.timeInMinutes}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('AmountOfCalories')}
                name="amountOfCalories"
                {...formItemLayout}
                initialValue={sessionModel?.amountOfCalories}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('ArDescription')}
                initialValue={sessionModel?.arDescription}
                name="arDescription"
                {...formItemLayout}
              >
                <CKEditor
                  config={config}
                  onInstanceReady={({ editor }) => {
                    this.arDescriptionEditor = editor;
                  }}
                  initData={this.state.arDescription}
                  onChange={(event) => {
                    this.props.formRef.current?.setFieldsValue({
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
                initialValue={sessionModel?.enDescription}
                {...formItemLayout}
                // rules={[{ message: L('ThisFieldIsRequired') }]}
              >
                <CKEditor
                  config={config}
                  initData={this.state.enDescription}
                  onInstanceReady={({ editor }) => {
                    this.enDescriptionEditor = editor;
                  }}
                  onChange={(event) => {
                    this.props.formRef.current?.setFieldsValue({
                      enDescription: event.editor.getData(),
                    });
                  }}
                />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem required label={L('SessionImage')} {...formItemLayout}>
                <img id="session-image" alt="session img" style={{ display: 'none' }} />
                <EditableImage
                  defaultFileList={
                    sessionModel !== undefined && sessionModel.imageUrl !== null
                      ? this.state.defaultImage
                      : []
                  }
                  onSuccess={(fileName) => {
                    document.getElementById('session-image')!.setAttribute('value', fileName);
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

export default CreateOrUpdateSession;
