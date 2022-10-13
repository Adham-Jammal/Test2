/* eslint-disable */
import * as React from 'react';
import { Component } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Form, Modal, Button, Input, Col, Select, Row, Spin } from 'antd';
import localization from '../../lib/localization';
import { L } from '../../i18next';
import rules from '../../scenes/RegisterShopManager/index.validation';
import { notifySuccess } from '../../lib/notifications';
import {
  ShopManagerDto,
  UpdateShopManagerDto,
} from '../../services/shopManagers/dto/shopManagerDto';
import shopManagersService from '../../services/shopManagers/shopManagersService';
import { countriesCodes, countyCode } from '../../constants';
import EditableImage from '../EditableImage';
declare let abp: any;

export interface IUpdateShopProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  formRef: React.RefObject<FormInstance>;
  userId: number;
}
export interface IUpdateShopProfileModalState {
  isSubmitting: boolean;
  isGettingData: boolean;
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

class UpdateShopProfileModal extends Component<
  IUpdateShopProfileModalProps,
  IUpdateShopProfileModalState
> {
  state = {
    isSubmitting: false,
    isGettingData: true,
  };
  data?: ShopManagerDto = undefined;

  async componentDidMount() {
    let result: ShopManagerDto = await shopManagersService.getMyInfo();
    this.setState({ isGettingData: false });
    this.data = result;
  }

  handleSubmit = async () => {
    const form = this.props.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.id = this.props.userId;
      const updateProfileObj: UpdateShopManagerDto = {
        id: values.id,
        emailAddress: values.emailAddress,
        surname: values.surname,
        name: values.name,
        shopOwnerCountryCode: values.shopOwnerCountryCode,
        shopOwnerPhoneNumber: values.shopOwnerPhoneNumber,
        phoneNumber: values.shopOwnerPhoneNumber,
        shopArLogoUrl: values.shopArLogoUrl,
        shopEnLogoUrl: values.shopEnLogoUrl,
        shopArCoverUrl: values.shopArCoverUrl,
        shopEnCoverUrl: values.shopEnCoverUrl,
        shopArDescription: values.shopArDescription,
        shopEnDescription: values.shopEnDescription,
        shopArName: values.shopArName,
        shopEnName: values.shopEnName,
      };

      try {
        this.setState({ isSubmitting: true });
        this.data = await shopManagersService.updateShopManager(updateProfileObj);
        //        form!.resetFields();
        this.props.onClose();
        notifySuccess();
        this.setState({ isSubmitting: false });
        abp.utils.setCookieValue(
          abp.auth.UserNameCookieName,
          values.name,
          new Date(new Date().getTime() + 1000 * 999999999),
          abp.appPath,
          abp.domain
        );
        abp.utils.setCookieValue(
          abp.auth.ImageCookieName,
          localization.isRTL() ? values.shopArCoverUrl : values.shopEnCoverUrl,
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
                    label={L('Name')}
                    name="name"
                    initialValue={this.data ? this.data.ownerName : undefined}
                    rules={rules.name}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  <Form.Item
                    {...formItemLayout}
                    colon={false}
                    label={L('Surname')}
                    rules={rules.name}
                    name="surname"
                    initialValue={this.data ? this.data.ownerSurname : undefined}
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
                    initialValue={this.data ? this.data.emailAddress : undefined}
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
                    initialValue={
                      this.data && this.data.countryCode ? this.data.countryCode : '+966'
                    }
                    label={L('CountryCode')}
                    name="shopOwnerCountryCode"
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
                    name="shopOwnerPhoneNumber"
                    label={L('PhoneNumber')}
                    initialValue={this.data ? this.data.phoneNumber : undefined}
                    rules={rules.phoneNumber}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col {...colLayout}>
                  <Form.Item
                    colon={false}
                    {...formItemLayout}
                    name="shopArName"
                    label={L('shopArName')}
                    initialValue={
                      this.data && this.data.shop && this.data.shop.arName
                        ? this.data.shop.arName
                        : undefined
                    }
                    rules={rules.name}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  <Form.Item
                    colon={false}
                    {...formItemLayout}
                    name="shopEnName"
                    label={L('shopEnName')}
                    initialValue={
                      this.data && this.data.shop && this.data.shop.enName
                        ? this.data.shop.enName
                        : undefined
                    }
                    rules={rules.name}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  <Form.Item
                    colon={false}
                    {...formItemLayout}
                    name="shopArDescription"
                    label={L('shopArDescription')}
                    initialValue={
                      this.data && this.data.shop && this.data.shop.arDescription
                        ? this.data.shop.arDescription
                        : undefined
                    }
                    rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  <Form.Item
                    colon={false}
                    {...formItemLayout}
                    name="shopEnDescription"
                    label={L('shopEnDescription')}
                    initialValue={
                      this.data && this.data.shop && this.data.shop.enDescription
                        ? this.data.shop.enDescription
                        : undefined
                    }
                    rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  <Form.Item
                    {...formItemLayout}
                    colon={false}
                    initialValue={
                      this.data && this.data.shop && this.data.shop.arLogoUrl
                        ? this.data.shop.arLogoUrl
                        : undefined
                    }
                    name="shopArLogoUrl"
                    label={L('shopArLogo')}
                  >
                    <EditableImage
                      defaultFileList={
                        this.data && this.data.shop && this.data.shop.arLogoUrl !== null
                          ? [
                              {
                                uid: '1',
                                status: 'done',
                                url: this.data.shop.arLogoUrl,
                              },
                            ]
                          : []
                      }
                      onSuccess={(url: string) => {
                        this.props.formRef.current!.setFieldsValue({ shopArLogoUrl: url });
                      }}
                      onRemove={() => {
                        this.props.formRef.current!.setFieldsValue({ shopArLogoUrl: undefined });
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col {...colLayout}>
                  <Form.Item
                    {...formItemLayout}
                    colon={false}
                    initialValue={
                      this.data && this.data.shop && this.data.shop.enLogoUrl
                        ? this.data.shop.enLogoUrl
                        : undefined
                    }
                    name="shopEnLogoUrl"
                    label={L('shopEnLogo')}
                  >
                    <EditableImage
                      defaultFileList={
                        this.data && this.data.shop && this.data.shop.enLogoUrl !== null
                          ? [
                              {
                                uid: '12',
                                status: 'done',
                                url: this.data.shop.enLogoUrl,
                              },
                            ]
                          : []
                      }
                      onSuccess={(url: string) => {
                        this.props.formRef.current!.setFieldsValue({ shopEnLogoUrl: url });
                      }}
                      onRemove={() => {
                        this.props.formRef.current!.setFieldsValue({ shopEnLogoUrl: undefined });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  <Form.Item
                    {...formItemLayout}
                    colon={false}
                    initialValue={
                      this.data && this.data.shop && this.data.shop.arCoverUrl
                        ? this.data.shop.arCoverUrl
                        : undefined
                    }
                    name="shopArCoverUrl"
                    label={L('shopArCover')}
                  >
                    <EditableImage
                      defaultFileList={
                        this.data && this.data.shop && this.data.shop.arCoverUrl !== null
                          ? [
                              {
                                uid: '1222',
                                status: 'done',
                                url: this.data.shop.arCoverUrl,
                              },
                            ]
                          : []
                      }
                      onSuccess={(url: string) => {
                        this.props.formRef.current!.setFieldsValue({ shopArCoverUrl: url });
                      }}
                      onRemove={() => {
                        this.props.formRef.current!.setFieldsValue({ shopArCoverUrl: undefined });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col {...colLayout}>
                  <Form.Item
                    {...formItemLayout}
                    colon={false}
                    initialValue={
                      this.data && this.data.shop && this.data.shop.enCoverUrl
                        ? this.data.shop.enCoverUrl
                        : undefined
                    }
                    name="shopEnCoverUrl"
                    label={L('shopEnCover')}
                  >
                    <EditableImage
                      defaultFileList={
                        this.data && this.data.shop && this.data.shop.enCoverUrl !== null
                          ? [
                              {
                                uid: '1',
                                status: 'done',
                                url: this.data.shop.enCoverUrl,
                              },
                            ]
                          : []
                      }
                      onSuccess={(url: string) => {
                        this.props.formRef.current!.setFieldsValue({ shopEnCoverUrl: url });
                      }}
                      onRemove={() => {
                        this.props.formRef.current!.setFieldsValue({ shopEnCoverUrl: undefined });
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

export default UpdateShopProfileModal;
