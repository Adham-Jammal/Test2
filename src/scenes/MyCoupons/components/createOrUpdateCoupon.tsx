/* eslint-disable */
import * as React from 'react';
import {
  Form,
  Modal,
  Button,
  Input,
  Switch,
  Select,
  DatePicker,
  Col,
  Row,
  InputNumber,
} from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import localization from '../../../lib/localization';
import { FormInstance } from 'antd/lib/form';
import CouponStore from '../../../stores/couponStore';
import { LiteEntityDto } from '../../../services/dto/liteEntityDto';
import classificationsService from '../../../services/classifications/classificationsService';
import { CreateCouponDto } from '../../../services/coupons/dto/createCouponDto';
import { UpdateCouponDto } from '../../../services/coupons/dto/updateCouponDto';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';
import clientsService from '../../../services/clients/clientsService';

export interface ICreateOrUpdateCouponProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  couponStore?: CouponStore;
  couponModalId: number;
  isSubmittingCoupon: boolean;
  formRef: React.RefObject<FormInstance>;
  shopId: number;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 6 },
    lg: { span: 8 },
    xl: { span: 8 },
    xxl: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 16 },
    lg: { span: 14 },
    xl: { span: 14 },
    xxl: { span: 14 },
  },
};
const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 12 },
  xl: { span: 12 },
  xxl: { span: 12 },
};

@inject(Stores.CouponStore)
@observer
class CreateOrUpdateCoupon extends React.Component<ICreateOrUpdateCouponProps, any> {
  classifications: LiteEntityDto[] = [];
  clients: LiteEntityDto[] = [];
  state = {
    forAllClients: undefined,
  };
  async componentDidMount() {
    let result = await classificationsService.getAllLite();
    this.classifications = result.items;
    const clientsResult = await clientsService.getAllLite({ isActive: true });
    this.clients = clientsResult.items;
  }

  componentDidUpdate() {
    const { couponModel } = this.props.couponStore!;
    if (couponModel && this.state.forAllClients === undefined) {
      if (couponModel.clients && couponModel.clients?.length > 0) {
        this.setState({ forAllClients: false });
      } else {
        this.setState({ forAllClients: true });
      }
    }
  }
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

  handleSubmit = async () => {
    const form = this.props.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.shopId = this.props.shopId;
      if (this.state.forAllClients === true) {
        values.clientIds = [];
      }
      if (this.props.couponModalId === 0) {
        await this.props.couponStore!.createCoupon(values as CreateCouponDto);
      } else {
        values.id = this.props.couponModalId;
        await this.props.couponStore!.updateCoupon(values as UpdateCouponDto);
      }
      await this.props.couponStore!.getCoupons();
      this.props.onCancel();
      form!.resetFields();
    });
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible, onCancel, modalType } = this.props;
    const { couponModel } = this.props.couponStore!;
    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateCoupon') : L('EditCoupon')}
        onCancel={onCancel}
        centered
        maskClosable={false}
        destroyOnClose
        width={'90%'}
        className={localization.isRTL() ? 'rtl-modal admin-modal' : 'ltr-modal admin-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingCoupon}
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
                label={L('Code')}
                name="code"
                {...formItemLayout}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                initialValue={couponModel !== undefined ? couponModel.code : undefined}
              >
                <Input />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('DiscountPercentage')}
                name="discountPercentage"
                {...formItemLayout}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                initialValue={
                  couponModel !== undefined ? couponModel.discountPercentage : undefined
                }
              >
                <InputNumber style={{ width: '100%' }} min="1" max="100" />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <Form.Item
                label={L('StartDate')}
                name="startDate"
                initialValue={
                  couponModel !== undefined && couponModel.startDate
                    ? moment(couponModel.startDate)
                    : undefined
                }
                rules={[
                  { required: true, message: L('ThisFieldIsRequired') },
                  {
                    validator: this.validateStartDate,
                  },
                ]}
                {...formItemLayout}
              >
                <DatePicker
                  onChange={() => this.props.formRef.current?.validateFields(['endDate'])}
                  placeholder={L('SelectDate')}
                  format={timingHelper.defaultDateFormat}
                />
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item
                rules={[
                  { required: true, message: L('ThisFieldIsRequired') },
                  {
                    validator: this.validateEndDate,
                  },
                ]}
                label={L('EndDate')}
                name="endDate"
                initialValue={
                  couponModel !== undefined && couponModel.endDate
                    ? moment(couponModel.endDate)
                    : undefined
                }
                {...formItemLayout}
              >
                <DatePicker
                  onChange={() => this.props.formRef.current?.validateFields(['startDate'])}
                  placeholder={L('SelectDate')}
                  format={timingHelper.defaultDateFormat}
                />
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <FormItem
                name="forAllClient"
                colon={false}
                label={L('ForAllClient')}
                {...formItemLayout}
                valuePropName="checked"
                initialValue={
                  this.state.forAllClients === undefined ? false : this.state.forAllClients
                }
              >
                <Switch
                  defaultChecked={
                    this.state.forAllClients === undefined ? false : this.state.forAllClients
                  }
                  checkedChildren={L('Yes')}
                  unCheckedChildren={L('No')}
                  onChange={(checked: boolean) => this.setState({ forAllClients: checked })}
                />
              </FormItem>
            </Col>
            {this.state.forAllClients !== true && (
              <Col {...colLayout}>
                <FormItem
                  label={L('Clients')}
                  {...formItemLayout}
                  initialValue={
                    couponModel !== undefined &&
                    couponModel.clients &&
                    couponModel.clients.length > 0
                      ? couponModel.clients.map((c: LiteEntityDto) => +c.value)
                      : undefined
                  }
                  name="clientIds"
                >
                  <Select
                    placeholder={L('PleaseSelectClients')}
                    showSearch
                    mode="multiple"
                    optionFilterProp="children"
                  >
                    {this.clients.length > 0 &&
                      this.clients.map((element: LiteEntityDto) => (
                        <Select.Option key={+element.value} value={+element.value}>
                          {element.text}
                        </Select.Option>
                      ))}
                  </Select>
                </FormItem>
              </Col>
            )}

            <Col {...colLayout}>
              <FormItem
                name="isFreeShipping"
                colon={false}
                label={L('IsFreeShipping')}
                {...formItemLayout}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                initialValue={
                  couponModel !== undefined && couponModel.isFreeShipping === true ? true : false
                }
                valuePropName="checked"
              >
                <Switch checkedChildren={L('Yes')} unCheckedChildren={L('No')} />
              </FormItem>
            </Col>

            <Col {...colLayout}>
              <FormItem
                label={L('MaxTotalUseCount')}
                name="maxTotalUseCount"
                {...formItemLayout}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                initialValue={couponModel !== undefined ? couponModel.maxTotalUseCount : undefined}
              >
                <InputNumber style={{ width: '100%' }} min="1" />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('MaxClientUseCount')}
                name="maxClientUseCount"
                {...formItemLayout}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                initialValue={couponModel !== undefined ? couponModel.maxClientUseCount : undefined}
              >
                <InputNumber style={{ width: '100%' }} min="1" />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('Classifications')}
                name="classifications"
                {...formItemLayout}
                initialValue={
                  couponModel !== undefined && couponModel.classifications
                    ? couponModel.classifications.map((item: LiteEntityDto) => item.value)
                    : []
                }
                colon={false}
              >
                <Select
                  placeholder={L('PleaseSelectClassifications')}
                  showSearch
                  mode="multiple"
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                    option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.classifications.length > 0 &&
                    this.classifications.map((element: LiteEntityDto) => (
                      <Select.Option key={element.value} value={element.value}>
                        {element.text}
                      </Select.Option>
                    ))}
                </Select>
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('EventOrganizerInfo')}
                name="eventOrganizerInfo"
                {...formItemLayout}
                colon={false}
                initialValue={
                  couponModel !== undefined ? couponModel.eventOrganizerInfo : undefined
                }
              >
                <Input.TextArea rows={4} />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateCoupon;
