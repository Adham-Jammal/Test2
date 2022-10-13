/* eslint-disable */
import * as React from 'react';
import { Form, Modal, Button, Input, Select, Col, Row } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import localization from '../../../lib/localization';
import { FormInstance } from 'antd/lib/form';
import ClientStore from '../../../stores/clientStore';
import locationsService from '../../../services/locations/locationsService';
import { LiteEntityDto } from '../../../services/locations/dto/liteEntityDto';
import { countriesCodes, countyCode } from '../../../constants';
import { LocationType } from '../../../lib/types';

export interface ICreateOrUpdateClientProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  clientStore?: ClientStore;
  onOk: () => void;
  isSubmittingClient: boolean;
  formRef: React.RefObject<FormInstance>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 6 },
    xl: { span: 6 },
    xxl: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 16 },
    lg: { span: 16 },
    xl: { span: 16 },
    xxl: { span: 16 },
  },
};
const formItemLayout2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 24 },
    xxl: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 24 },
    xxl: { span: 24 },
  },
};

@inject(Stores.ClientStore)
@observer
class CreateOrUpdateClient extends React.Component<ICreateOrUpdateClientProps, any> {
  cities: LiteEntityDto[] = [];

  state = {
    email: { value: '', validateStatus: undefined, errorMsg: null },
  };

  async componentDidMount() {
    let result = await locationsService.getAllLite({ type: LocationType.City });
    this.cities = result.items;
  }

  componentDidUpdate() {
    const { clientModel } = this.props.clientStore!;
    if (clientModel !== undefined && this.state.email.value !== clientModel.emailAddress) {
      this.onEmailChange({ target: { value: clientModel.emailAddress } });
    }
  }

  validateEmail = (value: string) => {
    let reqex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value !== '' && !reqex.test(value)) {
      return {
        validateStatus: 'error',
        errorMsg: L('ThisEmailIsInvalid'),
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

  onEmailChange = (e: any) => {
    let value = e.target.value;
    this.setState({ email: { ...this.validateEmail(value), value } });
  };

  handleSubmit = async () => {
    await this.props.onOk();
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible, onCancel, modalType } = this.props;
    const { clientModel } = this.props.clientStore!;

    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateClient') : L('EditClient')}
        onCancel={onCancel}
        centered
        destroyOnClose
        width={'80%'}
        maskClosable={false}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingClient}
            onClick={this.handleSubmit}
          >
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
        <div className="scrollable-modal">
          <Form ref={this.props.formRef}>
            <>
              <FormItem
                label={L('FirstName')}
                name="name"
                colon={false}
                {...formItemLayout}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                initialValue={clientModel !== undefined ? clientModel.name : undefined}
              >
                <Input />
              </FormItem>
              <FormItem
                label={L('Surname')}
                colon={false}
                name="surname"
                {...formItemLayout}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                initialValue={clientModel !== undefined ? clientModel.surname : undefined}
              >
                <Input />
              </FormItem>
              <FormItem
                label={L('Email')}
                colon={false}
                name="emailAddress"
                {...formItemLayout}
                initialValue={clientModel !== undefined ? clientModel.emailAddress : undefined}
                validateStatus={this.state.email.validateStatus}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                help={this.state.email.errorMsg}
              >
                <Input type="text" onChange={this.onEmailChange} onLoad={this.onEmailChange} />
              </FormItem>
              {modalType === 'create' && (
                <>
                  <Form.Item
                    colon={false}
                    name={'password'}
                    label={L('Password')}
                    {...formItemLayout}
                    rules={[
                      { required: true, message: L('ThisFieldIsRequired') },
                      {
                        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message: L('passwordValidation'),
                      },
                    ]}
                  >
                    <Input.Password visibilityToggle type="password" />
                  </Form.Item>
                  <Form.Item
                    label={L('ConfirmPassword')}
                    dependencies={['password']}
                    name="confirmPassword"
                    {...formItemLayout}
                    rules={[
                      { required: true, message: L('ThisFieldIsRequired') },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(L('TheTwoPasswordsThatYouEnteredDoNotMatch'))
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password visibilityToggle />
                  </Form.Item>
                </>
              )}
              <Row>
                <Col md={{ span: 5, offset: 0 }} xs={{ span: 9, offset: 0 }}>
                  {' '}
                  <FormItem
                    label={L('CountryCode')}
                    colon={false}
                    {...formItemLayout2}
                    name="countryCode"
                    initialValue={clientModel !== undefined ? clientModel.countryCode : '+966'}
                    rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
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
                  </FormItem>
                </Col>
                <Col xs={{ span: 14, offset: 1 }} md={{ span: 16, offset: 1 }}>
                  <FormItem
                    name="phoneNumber"
                    label={L('PhoneNumber')}
                    colon={false}
                    {...formItemLayout2}
                    initialValue={clientModel !== undefined ? clientModel.phoneNumber : undefined}
                    rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  >
                    <Input />
                  </FormItem>
                </Col>
              </Row>
            </>
            <FormItem
              label={L('City')}
              {...formItemLayout}
              colon={false}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              initialValue={clientModel !== undefined ? clientModel.city?.value : undefined}
              required
              name="cityId"
            >
              <Select
                placeholder={L('PleaseSelectCity')}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.cities.length > 0 &&
                  this.cities.map((element: LiteEntityDto) => (
                    <Select.Option key={element.value} value={element.value}>
                      {element.text}
                    </Select.Option>
                  ))}
              </Select>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default CreateOrUpdateClient;
