import React from 'react';
import { Modal, Button, Form, Input, Switch, Select, Col, Row, DatePicker } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import i18n, { L } from '../../../i18next';
import localization from '../../../lib/localization';
import arLocale from 'antd/es/date-picker/locale/ar_EG';
import enLocale from 'antd/es/date-picker/locale/en_US';
import { FormInstance } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import OffersStore from '../../../stores/offersStore';
import productsService from '../../../services/products/productsService';
import timingHelper from '../../../lib/timingHelper';
import { LiteEntityDto } from '../../../services/locations/dto/liteEntityDto';
import moment from 'moment';

export interface ICreateOrUpdateOfferProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  offersStore?: OffersStore;
  onOk: () => void;
  isSubmittingOffer: boolean;
  formRef: React.RefObject<FormInstance>;
}
export interface ICreateOrUpdateOfferState {
  forOrder?: boolean;
}

@inject(Stores.OffersStore)
@observer
class CreateOrUpdateOffer extends React.Component<
  ICreateOrUpdateOfferProps,
  ICreateOrUpdateOfferState
> {
  products: LiteEntityDto[] = [];

  handleSubmit = async () => {
    await this.props.onOk();
  };

  state = {
    forOrder: undefined,
  };

  formItemLayout = {
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

  colLayout = {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 12 },
    lg: { span: 12 },
    xl: { span: 12 },
    xxl: { span: 12 },
  };

  async componentDidMount() {
    let result = await productsService.getAllLite({});
    this.products = result.items;
  }

  handleCancel = () => {
    this.setState({ forOrder: undefined }, () => {
      this.props.onCancel();
    });
  };

  render() {
    const { visible, modalType } = this.props;
    const { offerModel } = this.props.offersStore!;

    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateOffer') : L('EditOffer')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose={true}
        maskClosable={false}
        width={'80%'}
        className={localization.isRTL() ? 'course-modal rtl-modal' : 'course-modal ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingOffer}
            onClick={this.handleSubmit}
          >
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
        <div className="">
          <Form ref={this.props.formRef}>
            <Row>
              <Col {...this.colLayout}>
                <FormItem
                  label={L('StartDate')}
                  colon={false}
                  initialValue={offerModel !== undefined ? moment(offerModel.startDate) : undefined}
                  name="startDate"
                  {...this.formItemLayout}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                >
                  <DatePicker
                    defaultValue={
                      offerModel !== undefined ? moment(offerModel.startDate) : undefined
                    }
                    locale={i18n.language === 'ar' ? arLocale : enLocale}
                    placeholder={L('PleaseSelectDate')}
                    format={timingHelper.defaultDateFormat}
                  />
                </FormItem>
              </Col>
              <Col {...this.colLayout}>
                <FormItem
                  label={L('EndDate')}
                  colon={false}
                  initialValue={offerModel !== undefined ? moment(offerModel.endDate) : undefined}
                  name="endDate"
                  {...this.formItemLayout}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                >
                  <DatePicker
                    defaultValue={offerModel !== undefined ? moment(offerModel.endDate) : undefined}
                    locale={i18n.language === 'ar' ? arLocale : enLocale}
                    placeholder={L('PleaseSelectDate')}
                    format={timingHelper.defaultDateFormat}
                  />
                </FormItem>
              </Col>

              <Col {...this.colLayout}>
                <FormItem
                  name="type"
                  colon={false}
                  label={L('Type')}
                  {...this.formItemLayout}
                  initialValue={offerModel !== undefined && offerModel.type === 0 ? true : false}
                  valuePropName="checked"
                >
                  <Switch
                    onChange={(value) => {
                      this.setState({ forOrder: value });
                    }}
                    checkedChildren={L('ForOrder')}
                    unCheckedChildren={L('ForProduct')}
                  />
                </FormItem>
              </Col>

              {(offerModel !== undefined &&
                offerModel.type === 0 &&
                this.props.formRef.current?.getFieldValue(['type']) === true) ||
              (offerModel !== undefined && offerModel.type === 0) ? (
                <>
                  <Col {...this.colLayout}>
                    <FormItem
                      label={L('DiscountPercentage')}
                      initialValue={
                        offerModel !== undefined && offerModel.percentage
                          ? offerModel.percentage
                          : undefined
                      }
                      colon={false}
                      name="percentage"
                      {...this.formItemLayout}
                      rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                    >
                      <Input type="number" min="1" max="100" />
                    </FormItem>
                  </Col>

                  <Col {...this.colLayout}>
                    <FormItem
                      label={L('OrderedMinValue')}
                      initialValue={
                        offerModel !== undefined && offerModel.orderMinValue !== undefined
                          ? offerModel.orderMinValue
                          : undefined
                      }
                      name="orderMinValue"
                      {...this.formItemLayout}
                      colon={false}
                    >
                      <Input type="number" min="0" />
                    </FormItem>
                  </Col>
                </>
              ) : (
                <>
                  <Col {...this.colLayout}>
                    <FormItem
                      label={L('DiscountPercentage')}
                      initialValue={
                        offerModel !== undefined && offerModel.percentage
                          ? offerModel.percentage
                          : undefined
                      }
                      colon={false}
                      name="percentage"
                      {...this.formItemLayout}
                      rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                    >
                      <Input type="number" min="1" max="100" />
                    </FormItem>
                  </Col>
                  <Col {...this.colLayout}>
                    <FormItem
                      label={L('Products')}
                      initialValue={
                        offerModel !== undefined && offerModel.products !== undefined
                          ? offerModel.products.map((i) => i.value)
                          : undefined
                      }
                      name="products"
                      {...this.formItemLayout}
                      colon={false}
                    >
                      <Select
                        placeholder={L('PleaseSelectProducts')}
                        showSearch
                        mode={'multiple'}
                        optionFilterProp="children"
                        filterOption={(input, option: any) =>
                          option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.products.length > 0 &&
                          this.products.map((element: LiteEntityDto) => (
                            <Select.Option key={element.value} value={element.value}>
                              {element.text}
                            </Select.Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>
                </>
              )}
            </Row>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default CreateOrUpdateOffer;
