/* eslint-disable */
import * as React from 'react';
import { Component } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Form, Modal, Button, Input, Col, Select, Row, Spin } from 'antd';
import localization from '../../lib/localization';
import { L } from '../../i18next';
import EventOrganizerService from '../../services/eventOrganizer/index';
import * as rules from '../../scenes/RegisterEventOrganizer/validations';
import { notifySuccess } from '../../lib/notifications';
import { countriesCodes, countyCode } from '../../constants';
import EditableImage from '../EditableImage';
import {
  CreateOrUpdateEventOrganizerDto,
  EventOrganizerDto,
} from '../../services/eventOrganizer/dto';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';
import indexesService from '../../services/indexes/indexesService';
import { IndexType } from '../../lib/types';

export interface IUpdateOrganizerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  formRef: React.RefObject<FormInstance>;
  userId: number;
}
declare let abp: any;

export interface IUpdateOrganizerProfileModalState {
  isSubmitting: boolean;
  isGettingData: boolean;
  data: EventOrganizerDto;
  banks: LiteEntityDto[];
}

const formItemLayout = {
  labelCol: {
    xs: { span: 23 },
    sm: { span: 23 },
    md: { span: 23 },
    lg: { span: 23 },
    xl: { span: 23 },
    xxl: { span: 23 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
    md: { span: 20 },
    lg: { span: 20 },
    xl: { span: 20 },
    xxl: { span: 20 },
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

class UpdateOrganizerProfileModal extends Component<
  IUpdateOrganizerProfileModalProps,
  IUpdateOrganizerProfileModalState
> {
  state = {
    isSubmitting: false,
    isGettingData: true,
    data: {
      name: undefined,
      surname: undefined,
      phoneNumber: undefined,
      countryCode: undefined,
      emailAddress: undefined,
      isActive: true,
      userName: undefined,
      registrationDate: undefined,
      id: 0,
      licenseUrl: undefined,
      bankId: 0,
      bankName: undefined,
      accountNumber: undefined,
      companyWebsite: undefined,
      imageUrl: undefined,
      isLive: false,
    },
    banks: [],
  };

  async componentDidMount() {
    const result2 = await indexesService.getAllLite({
      maxResultCount: 100,
      skipCount: 0,
      type: IndexType.Bank,
    });
    let result: EventOrganizerDto = await EventOrganizerService.getEventOrganizer({
      id: this.props.userId,
    });

    this.setState({ isGettingData: false, data: result, banks: result2.items });
  }

  handleSubmit = async () => {
    const form = this.props.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.id = this.props.userId;
      const updateProfileObj: CreateOrUpdateEventOrganizerDto = {
        id: values.id,
        imageUrl: values.imageUrl,
        countryCode: values.countryCode,
        phoneNumber: values.phoneNumber,
        emailAddress: values.emailAddress,
        accountNumber: values.accountNumber,
        bankId: values.bankId,
        companyWebsite: values.companyWebsite,
        firstName: values.firstName,
        lastname: values.lastname,
        userName: values.userName,
      };

      try {
        this.setState({ isSubmitting: true });
        let newData = await EventOrganizerService.updateEventOrganizer(updateProfileObj);
        this.setState({ data: newData });
        this.props.onClose();
        notifySuccess();
        this.setState({ isSubmitting: false });
        abp.utils.setCookieValue(
          abp.auth.UserNameCookieName,
          values.firstName,
          new Date(new Date().getTime() + 1000 * 999999999),
          abp.appPath,
          abp.domain
        );
        abp.utils.setCookieValue(
          abp.auth.ImageCookieName,
          values.imageUrl,
          new Date(new Date().getTime() + 1000 * 999999999),
          abp.appPath,
          abp.domain
        );
        window.location.reload();
      } catch {
        this.setState({ isSubmitting: false });
      }
    });
  };

  handleCancel = () => {
    this.props.onClose();
  };

  render() {
    const { isOpen, onClose } = this.props;
    const { banks, data } = this.state;

    return (
      <Modal
        visible={isOpen}
        title={L('EditProfile')}
        onCancel={onClose}
        width={'80%'}
        centered
        maskClosable={false}
        destroyOnClose
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.state.isSubmitting}
            onClick={this.handleSubmit}
          >
            {L('Edit')}
          </Button>,
        ]}
      >
        <div className="scrollable-modal">
          {this.state.isGettingData ? (
            <div className="loading-comp">
              <Spin size="large" />
            </div>
          ) : (
            <Form ref={this.props.formRef}>
              <Row>
                <Col {...colLayout}>
                  <Form.Item
                    {...formItemLayout}
                    colon={false}
                    label={L('FirstName')}
                    name="firstName"
                    initialValue={data ? data.name : undefined}
                    rules={rules.firstName}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  <Form.Item
                    {...formItemLayout}
                    colon={false}
                    label={L('lastName')}
                    rules={rules.lastName}
                    name="lastname"
                    initialValue={data ? data.surname : undefined}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  <Form.Item
                    {...formItemLayout}
                    colon={false}
                    label={L('UserName')}
                    rules={rules.userName}
                    name="userName"
                    initialValue={data ? data.userName : undefined}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col {...colLayout}>
                  <Form.Item
                    {...formItemLayout}
                    colon={false}
                    name="emailAddress"
                    label={L('Email')}
                    rules={rules.email}
                    initialValue={data ? data.emailAddress : undefined}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  {' '}
                  <Form.Item
                    colon={false}
                    {...formItemLayout}
                    rules={[
                      {
                        required: true,
                        message: L('ThisFieldIsRequired'),
                      },
                    ]}
                    initialValue={data && data.countryCode ? data.countryCode : '+966'}
                    label={L('CountryCode')}
                    name="countryCode"
                  >
                    <Select
                      className="country-code-dropdown"
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children[2].props.children[1].indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        optionA.children[2].props.children[1].localeCompare(
                          optionB.children[2].props.children[1]
                        )
                      }
                      showSearch
                    >
                      {countriesCodes.map((country: countyCode, index: number) => {
                        return (
                          <Select.Option value={country.dial_code} key={index}>
                            <i className={'famfamfam-flags ' + country.code.toLowerCase()} />{' '}
                            <span className="code-opt"> {country.dial_code}</span>
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  <Form.Item
                    colon={false}
                    {...formItemLayout}
                    name="phoneNumber"
                    label={L('PhoneNumber')}
                    initialValue={data ? data.phoneNumber : undefined}
                    rules={rules.phoneNumber}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col {...colLayout}>
                  <Form.Item
                    {...formItemLayout}
                    colon={false}
                    name="bankId"
                    label={L('Bank')}
                    rules={[rules.required]}
                    initialValue={
                      data && data.bankId !== undefined ? data.bankId.toString() : undefined
                    }
                  >
                    <Select
                      placeholder={L('PleaseSelectABank')}
                      defaultValue={
                        data && data.bankId !== undefined ? data.bankId.toString() : undefined
                      }
                    >
                      {data &&
                        banks &&
                        banks.length > 0 &&
                        banks.map((bank: LiteEntityDto) => (
                          <Select.Option key={bank.value.toString()} value={bank.value.toString()}>
                            {bank.text}
                          </Select.Option>
                        ))}
                    </Select>{' '}
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  <Form.Item
                    {...formItemLayout}
                    colon={false}
                    name="accountNumber"
                    label={L('BankAccountNumber')}
                    rules={rules.accountNumber}
                    initialValue={data && data.accountNumber ? data.accountNumber : undefined}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  <Form.Item
                    {...formItemLayout}
                    colon={false}
                    name="companyWebsite"
                    label={L('companyWebsite')}
                    initialValue={data && data.companyWebsite ? data.companyWebsite : undefined}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  <Form.Item
                    {...formItemLayout}
                    colon={false}
                    initialValue={data ? data.imageUrl : undefined}
                    name="imageUrl"
                    label={L('Image')}
                  >
                    <EditableImage
                      defaultFileList={
                        data && data.imageUrl !== null
                          ? [
                              {
                                uid: '1',
                                status: 'done',
                                url: data.imageUrl,
                              },
                            ]
                          : []
                      }
                      onSuccess={(url: string) => {
                        this.props.formRef.current!.setFieldsValue({ imageUrl: url });
                      }}
                      onRemove={() => {
                        this.props.formRef.current!.setFieldsValue({ imageUrl: undefined });
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          )}
        </div>
      </Modal>
    );
  }
}

export default UpdateOrganizerProfileModal;
