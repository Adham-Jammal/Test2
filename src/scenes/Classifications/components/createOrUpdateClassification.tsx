/* eslint-disable */
import * as React from 'react';
import { Form, Modal, Button, Input, Select, Col, Row } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import localization from '../../../lib/localization';
import EditableImage from '../../../components/EditableImage';
import { FormInstance } from 'antd/lib/form';
import ClassificationStore from '../../../stores/classificationStore';
import { LiteEntityDto } from '../../../services/locations/dto/liteEntityDto';
import categoriesService from '../../../services/categories/categoriesService';
import { ImageAttr } from '../../../services/dto/imageAttr';

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

export interface ICreateOrUpdateClassificationState {
  defaultImage: Array<ImageAttr>;
  arName: { value: string; validateStatus?: string; errorMsg: string | null };
  enName: { value: string; validateStatus?: string; errorMsg: string | null };
}
@inject(Stores.ClassificationStore)
@observer
class CreateOrUpdateClassification extends React.Component<
  ICreateOrUpdateClassificationProps,
  ICreateOrUpdateClassificationState
> {
  formRef = React.createRef<FormInstance>();
  categories: LiteEntityDto[] = [];

  async componentDidMount() {
    let result = await categoriesService.getAllLite();
    this.categories = result.items;
  }

  state = {
    arName: { value: '', validateStatus: undefined, errorMsg: null },
    enName: { value: '', validateStatus: undefined, errorMsg: null },
    defaultImage: [],
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

  componentDidUpdate() {
    const { classificationModel } = this.props.classificationStore!;

    if (
      this.state.defaultImage.length === 0 &&
      classificationModel !== undefined &&
      classificationModel.imageUrl !== null
    ) {
      this.setState({
        defaultImage: [
          {
            uid: 1,
            name: `classificationImage.png`,
            status: 'done',
            url: classificationModel.imageUrl,
            thumbUrl: classificationModel.imageUrl,
          },
        ],
      });
    }

    if (classificationModel === undefined && this.state.defaultImage.length > 0) {
      this.setState({ defaultImage: [] });
    }
    if (
      classificationModel !== undefined &&
      classificationModel.imageUrl !== null &&
      this.state.defaultImage.length > 0 &&
      this.state.defaultImage[0]['url'] !== classificationModel.imageUrl
    ) {
      this.setState({ defaultImage: [] });
    }
  }

  render() {
    const { visible, modalType } = this.props;
    const { classificationModel } = this.props.classificationStore!;

    if (this.props.visible === false && document.getElementById('classification-image') != null)
      document.getElementById('classification-image')!.setAttribute('value', '');

    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateClassification') : L('EditClassification')}
        onCancel={this.handleCancel}
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
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                validateStatus={this.state.enName.validateStatus}
                help={this.state.enName.errorMsg}
              >
                <Input type="text" onChange={this.onEnChange} onLoad={this.onEnChange} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('Category')}
                name="categoryId"
                {...formItemLayout}
                initialValue={
                  classificationModel !== undefined && classificationModel.category
                    ? classificationModel.category.value
                    : undefined
                }
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              >
                <Select
                  placeholder={L('PleaseSelectCategory')}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                    option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.categories.length > 0 &&
                    this.categories.map((element: LiteEntityDto) => (
                      <Select.Option key={element.value} value={element.value}>
                        {element.text}
                      </Select.Option>
                    ))}
                </Select>
              </FormItem>
            </Col>

            <Col {...colLayout}>
              <FormItem label={L('Image')} required {...formItemLayout}>
                <img id="classification-image" style={{ display: 'none' }} />
                <EditableImage
                  defaultFileList={
                    classificationModel !== undefined && classificationModel.imageUrl !== null
                      ? this.state.defaultImage
                      : []
                  }
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
