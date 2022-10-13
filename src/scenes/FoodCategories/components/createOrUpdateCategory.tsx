/* eslint-disable */
import * as React from 'react';
import { Form, Modal, Button, Input, Row, Col } from 'antd';
import CategoryStore from '../../../stores/categoryStore';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import localization from '../../../lib/localization';
import EditableImage from '../../../components/EditableImage';
import { FormInstance } from 'antd/lib/form';
import { ImageAttr } from '../../../services/dto/imageAttr';
import FoodCategoryStore from '../../../stores/foodCategoryStore';

export interface ICreateOrUpdateCategoryProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  categoryStore?: CategoryStore;
  onOk: () => void;
  isSubmittingCategory: boolean;
  formRef: React.RefObject<FormInstance>;
  foodCategoryStore: FoodCategoryStore;
}

export interface ICreateOrUpdateCategoryState {
  defaultcategoryImage: Array<ImageAttr>;
  arName: { value: string; validateStatus?: string; errorMsg: string | null };
  enName: { value: string; validateStatus?: string; errorMsg: string | null };
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

@inject(Stores.FoodCategoryStore)
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

  componentDidUpdate() {
    const { categoryModel } = this.props.foodCategoryStore!;

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

  render() {
    const { visible, onCancel, modalType } = this.props;
    const { categoryModel } = this.props.foodCategoryStore!;

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
                  categoryModel !== undefined && categoryModel.arTitle
                    ? categoryModel.arTitle
                    : undefined
                }
                name="arTitle"
                {...formItemLayout}
              >
                <Input type="text" onLoad={this.onArChange} onChange={this.onArChange} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('EnName')}
                name="enTitle"
                colon={false}
                {...formItemLayout}
                initialValue={
                  categoryModel !== undefined && categoryModel.enTitle
                    ? categoryModel.enTitle
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
