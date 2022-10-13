/* eslint-disable */
import * as React from 'react';
import { Form, Modal, Button, Input, Row, Col } from 'antd';
import { FormInstance } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import { inject, observer } from 'mobx-react';
import Stores from '../../../stores/storeIdentifier';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import NewsCategoryStore from '../../../stores/newsCategoryStore';
import { ImageAttr } from '../../../services/dto/imageAttr';
import EditableImage from '../../../components/EditableImage';

export interface ICreateOrUpdateCategoryProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  newsCategoryStore?: NewsCategoryStore;
  onOk: () => void;
  isSubmittingCategory: boolean;
  formRef: React.RefObject<FormInstance>;
}

export interface ICreateOrUpdateCategoryState {
  arName: { value: string; validateStatus?: string; errorMsg: string | null };
  enName: { value: string; validateStatus?: string; errorMsg: string | null };
  defaultcategoryImage: Array<ImageAttr>;
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

@inject(Stores.NewsCategoryStore)
@observer
class CreateOrUpdateCategory extends React.Component<
  ICreateOrUpdateCategoryProps,
  ICreateOrUpdateCategoryState
> {
  formRef = React.createRef<FormInstance>();

  state = {
    arName: { value: '', validateStatus: undefined, errorMsg: null },
    enName: { value: '', validateStatus: undefined, errorMsg: null },
    defaultcategoryImage: [],
  };

  componentDidUpdate() {
    const { categoryModel } = this.props.newsCategoryStore!;

    if (
      this.state.defaultcategoryImage.length === 0 &&
      categoryModel !== undefined &&
      categoryModel.imageUrl !== null
    ) {
      this.setState({
        defaultcategoryImage: [
          {
            uid: 1,
            name: `categoryImage.png`,
            status: 'done',
            url: categoryModel.imageUrl,
            thumbUrl: categoryModel.imageUrl,
          },
        ],
      });
    }

    if (categoryModel === undefined && this.state.defaultcategoryImage.length > 0) {
      this.setState({ defaultcategoryImage: [] });
    }
    if (
      categoryModel !== undefined &&
      categoryModel.imageUrl !== null &&
      this.state.defaultcategoryImage.length > 0 &&
      this.state.defaultcategoryImage[0]['url'] !== categoryModel.imageUrl
    ) {
      this.setState({ defaultcategoryImage: [] });
    }
  }

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

  handleCancel = () => {
    this.props.onCancel();
  };

  onArChange = (e: any) => {
    let value = e.target.value;
    this.setState({ arName: { ...this.validateArName(value), value } });
  };

  onEnChange = (e: any) => {
    let value = e.target.value;
    this.setState({ enName: { ...this.validateEnName(value), value } });
  };

  render() {
    const { visible, onCancel, modalType } = this.props;
    const { categoryModel } = this.props.newsCategoryStore!;

    if (this.props.visible === false && document.getElementById('category-image') != null)
      document.getElementById('category-image')!.setAttribute('value', '');

    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateCategory') : L('EditCategory')}
        onCancel={onCancel}
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
            loading={this.props.isSubmittingCategory}
            onClick={this.handleSubmit}
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
                validateStatus={this.state.arName.validateStatus}
                help={this.state.arName.errorMsg}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                initialValue={
                  categoryModel !== undefined && categoryModel.arName
                    ? categoryModel.arName
                    : undefined
                }
                name="arName"
                {...formItemLayout}
              >
                <Input type="text" onLoad={this.onArChange} onChange={this.onArChange} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('EnName')}
                name="enName"
                colon={false}
                {...formItemLayout}
                initialValue={
                  categoryModel !== undefined && categoryModel.enName
                    ? categoryModel.enName
                    : undefined
                }
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                validateStatus={this.state.enName.validateStatus}
                help={this.state.enName.errorMsg}
              >
                <Input type="text" onLoad={this.onEnChange} onChange={this.onEnChange} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label={L('Image')} required colon={false} {...formItemLayout}>
                <img id="category-image" alt="category img" style={{ display: 'none' }} />

                <EditableImage
                  defaultFileList={
                    categoryModel !== undefined && categoryModel.imageUrl !== null
                      ? this.state.defaultcategoryImage
                      : []
                  }
                  onSuccess={(fileName) => {
                    document.getElementById('category-image')!.setAttribute('value', fileName);
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

export default CreateOrUpdateCategory;
