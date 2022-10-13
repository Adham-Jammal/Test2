/* eslint-disable */
import * as React from 'react';
import { Form, Modal, Button, DatePicker, Col, Row } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import localization from '../../../lib/localization';
import { FormInstance } from 'antd/lib/form';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';
import SliderImageStore from '../../../stores/sliderImageStore';
import { CreateSliderImageDto } from '../../../services/sliderImages/dto/createSliderImageDto';
import { UpdateSliderImageDto } from '../../../services/sliderImages/dto/updateSliderImageDto';
import EditableImage from '../../../components/EditableImage';
import { ImageAttr } from '../../../services/dto/imageAttr';

export interface ICreateOrUpdateSliderImageProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  sliderImageStore?: SliderImageStore;
  sliderImageModalId: number;
  isSubmittingSliderImage: boolean;
  formRef: React.RefObject<FormInstance>;
  shopId: number;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 9 },
    xl: { span: 9 },
    xxl: { span: 9 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 15 },
    xl: { span: 15 },
    xxl: { span: 15 },
  },
};

export interface ICreateOrUpdateSliderImageState {
  defaultImage: Array<ImageAttr>;
}

@inject(Stores.SliderImageStore)
@observer
class CreateOrUpdateSliderImage extends React.Component<
  ICreateOrUpdateSliderImageProps,
  ICreateOrUpdateSliderImageState
> {
  state = {
    defaultImage: [],
  };

  // validate end date
  validateEndDate = (_1: any, value: number) => {
    const startDate = this.props.formRef.current?.getFieldValue('startDate');
    let yesterday = new Date().setDate(new Date().getDate() - 1);
    if (moment(new Date(value)).isSameOrBefore(yesterday)) {
      return Promise.reject(L('EndDateMustBeAfterOrEqualToTodayDate'));
    } else if (value !== undefined && value !== null && startDate) {
      if (moment(new Date(value)).isBefore(new Date(startDate))) {
        return Promise.reject(L('TheEndDateMustAfterOrEqualToStartDate'));
      }
    } else return Promise.resolve();

    return Promise.resolve();
  };

  // validate start date
  validateStartDate = (_1: any, value: number) => {
    const endDate = this.props.formRef.current?.getFieldValue('endDate');
    let yesterday = new Date().setDate(new Date().getDate() - 1);
    if (moment(new Date(value)).isSameOrBefore(yesterday)) {
      return Promise.reject(L('StartDateMustBeAfterOrEqualToTodayDate'));
    } else if (value !== undefined && value !== null && endDate) {
      if (moment(new Date(value)).isAfter(new Date(endDate))) {
        return Promise.reject(L('TheStartDateMustBeLessThanEndDate'));
      }
    } else return Promise.resolve();
    return Promise.resolve();
  };

  componentDidUpdate() {
    const { SliderImageModel } = this.props.sliderImageStore!;

    if (
      this.state.defaultImage.length === 0 &&
      SliderImageModel !== undefined &&
      SliderImageModel.imageUrl !== null
    ) {
      this.setState({
        defaultImage: [
          {
            uid: 1,
            name: `passportImage.png`,
            status: 'done',
            url: SliderImageModel.imageUrl,
            thumbUrl: SliderImageModel.imageUrl,
          },
        ],
      });
    }
    if (SliderImageModel === undefined && this.state.defaultImage.length > 0) {
      this.setState({ defaultImage: [] });
    }
    if (
      SliderImageModel !== undefined &&
      SliderImageModel.imageUrl !== null &&
      this.state.defaultImage.length > 0 &&
      this.state.defaultImage[0]['url'] !== SliderImageModel.imageUrl
    ) {
      this.setState({ defaultImage: [] });
    }
  }

  handleSubmit = async () => {
    const form = this.props.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.shopId = this.props.shopId;
      values.imageUrl = document.getElementById('image')!.getAttribute('value')
        ? document.getElementById('image')!.getAttribute('value')
        : this.props.sliderImageStore!.SliderImageModel?.imageUrl;

      if (this.props.sliderImageModalId === 0) {
        await this.props.sliderImageStore!.createSliderImage(values as CreateSliderImageDto);
      } else {
        values.id = this.props.sliderImageModalId;
        await this.props.sliderImageStore!.updateSliderImage(values as UpdateSliderImageDto);
      }
      await this.props.sliderImageStore!.getSliderImages();
      this.props.onCancel();
      form!.resetFields();
    });
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible, onCancel, modalType } = this.props;
    const { SliderImageModel } = this.props.sliderImageStore!;
    if (this.props.visible === false && document.getElementById('image') != null)
      document.getElementById('image')!.setAttribute('value', '');

    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateSliderImage') : L('EditSliderImage')}
        onCancel={onCancel}
        centered
        maskClosable={false}
        destroyOnClose
        width={'80%'}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingSliderImage}
            onClick={this.handleSubmit}
          >
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
        <Form ref={this.props.formRef}>
          <Row>
            <Col
              xs={{ span: 24, offset: 0 }}
              md={{ span: 20, offset: 0 }}
              lg={{ span: 11, offset: 0 }}
            >
              <Form.Item
                label={L('StartDate')}
                name="startDate"
                initialValue={
                  SliderImageModel !== undefined && SliderImageModel.startDate
                    ? moment(SliderImageModel.startDate)
                    : undefined
                }
                {...formItemLayout}
                rules={[
                  { required: true, message: L('ThisFieldIsRequired') },
                  {
                    validator: this.validateStartDate,
                  },
                ]}
              >
                <DatePicker
                  onChange={() => this.props.formRef.current?.validateFields(['endDate'])}
                  placeholder={L('SelectDate')}
                  format={timingHelper.defaultDateFormat}
                />
              </Form.Item>
              <FormItem label={L('Image')} required {...formItemLayout}>
                <img id="image" style={{ display: 'none' }} />
                <EditableImage
                  defaultFileList={
                    SliderImageModel !== undefined && SliderImageModel.imageUrl !== null
                      ? this.state.defaultImage
                      : []
                  }
                  onSuccess={(fileName) => {
                    document.getElementById('image')!.setAttribute('value', fileName);
                  }}
                />
              </FormItem>
            </Col>

            <Col
              xs={{ span: 24, offset: 0 }}
              md={{ span: 20, offset: 0 }}
              lg={{ span: 11, offset: 2 }}
            >
              <Form.Item
                label={L('EndDate')}
                name="endDate"
                initialValue={
                  SliderImageModel !== undefined && SliderImageModel.endDate
                    ? moment(SliderImageModel.endDate)
                    : undefined
                }
                {...formItemLayout}
                rules={[
                  { required: true, message: L('ThisFieldIsRequired') },
                  {
                    validator: this.validateEndDate,
                  },
                ]}
              >
                <DatePicker
                  onChange={() => this.props.formRef.current?.validateFields(['startDate'])}
                  placeholder={L('SelectDate')}
                  format={timingHelper.defaultDateFormat}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateSliderImage;
