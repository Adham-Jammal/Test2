/* eslint-disable */

import React, { useEffect } from 'react';
import { Form, Button, Steps, Modal, Spin, Input, Select, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { L } from '../../../i18next';
import * as rules from '../../RegisterEventOrganizer/validations';
import localization from '../../../lib/localization';
import { LiteEntityDto } from '../../../services/dto/liteEntityDto';
import { useStepsForm } from 'sunflower-antd';
import { countriesCodes, countyCode } from '../../../constants';
import EditableImage from '../../../components/EditableImage';
import {
  CreateOrUpdateEventOrganizerDto,
  EventOrganizerDto,
} from '../../../services/eventOrganizer/dto';

interface CreateOrUpdateEventOrganizerProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: (values: CreateOrUpdateEventOrganizerDto) => void;
  isSubmittingEventOrganizer: boolean;
  isGettingData: boolean;
  eventOrganizerData?: EventOrganizerDto;
  banks?: LiteEntityDto[];
}

const { Step } = Steps;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const CreateOrUpdateEventOrganizer: React.FC<CreateOrUpdateEventOrganizerProps> = ({
  visible,
  onCancel,
  modalType,
  onOk,
  isSubmittingEventOrganizer,
  isGettingData,
  eventOrganizerData,
  banks = [],
}) => {
  const [image, setImage] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    if (modalType === 'update' && eventOrganizerData) {
      setImage(eventOrganizerData.imageUrl);
    } else if (modalType === 'create') {
      form.resetFields();
    }
    gotoStep(0);
  }, [eventOrganizerData, modalType]);
  const handleCancelModal = async () => {
    await form.resetFields();
    onCancel();
  };

  const {
    form,
    current = 0,
    gotoStep,
    stepsProps,
    formProps,
    submit,
  } = useStepsForm({
    async submit(values) {
      const {
        firstName,
        lastname,
        emailAddress,
        password,
        userName,
        countryCode,
        phoneNumber,
        // birthDate,
        //licenseUrl,
        bankId,
        accountNumber,
        companyWebsite,
        imageUrl,
      } = values;

      const newValues: CreateOrUpdateEventOrganizerDto = {
        firstName: firstName?.toString(),
        lastname: lastname?.toString(),
        emailAddress: emailAddress?.toString(),
        password: password?.toString(),
        userName: userName?.toString(),
        countryCode: countryCode?.toString(),
        phoneNumber: phoneNumber?.toString(),
        //   licenseUrl: licenseUrl?.toString(),
        bankId: +bankId?.toString(),
        accountNumber: accountNumber?.toString(),
        companyWebsite: companyWebsite?.toString(),
        imageUrl: imageUrl?.toString(),
        //  birthDate: new Date(birthDate?.toString()),
      };

      const submitData =
        modalType === 'update' ? { ...newValues, id: eventOrganizerData!.id } : newValues;
      await onOk(submitData);
      await handleCancelModal();

      return 'ok';
    },
    total: 3,
  });

  const formList = [
    <>
      <Row>
        <Col md={{ span: 11, offset: 0 }} xs={24}>
          <Form.Item
            initialValue={eventOrganizerData ? eventOrganizerData.name : undefined}
            name="firstName"
            label={L('FirstName')}
            rules={rules.firstName}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={{ span: 11, offset: 2 }} xs={24}>
          <Form.Item
            initialValue={eventOrganizerData ? eventOrganizerData.surname : undefined}
            name="lastname"
            label={L('lastName')}
            rules={rules.lastName}
          >
            <Input autoComplete="off" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="emailAddress"
        initialValue={eventOrganizerData ? eventOrganizerData.emailAddress : undefined}
        label={L('Email')}
        rules={rules.email}
      >
        <Input autoComplete="off" />
      </Form.Item>
      {modalType === 'create' && (
        <Form.Item name="password" label={L('Password')} rules={rules.password}>
          <Input.Password visibilityToggle type="password" />
        </Form.Item>
      )}
    </>,
    <>
      <Form.Item
        name="userName"
        initialValue={eventOrganizerData ? eventOrganizerData.userName + '' : undefined}
        rules={rules.userName}
        label={L('UserName')}
      >
        <Input />
      </Form.Item>
      <Row>
        <Col md={{ span: 6, offset: 0 }} xs={24}>
          <Form.Item
            initialValue={eventOrganizerData ? eventOrganizerData.countryCode + '' : '+966'}
            name="countryCode"
            label={L('CountryCode')}
          >
            <Select
              optionFilterProp="children"
              className="country-code-dropdown"
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
        <Col md={{ span: 17, offset: 1 }} xs={24}>
          <Form.Item
            className="phone-number"
            name="phoneNumber"
            rules={rules.phoneNumber}
            initialValue={eventOrganizerData ? eventOrganizerData.phoneNumber + '' : undefined}
            label={L('PhoneNumber')}
          >
            <Input />
          </Form.Item>
        </Col>
        <Form.Item
          name="imageUrl"
          initialValue={eventOrganizerData ? eventOrganizerData.imageUrl + '' : undefined}
          label={L('Image')}
        >
          <EditableImage
            defaultFileList={
              image !== undefined
                ? [
                    {
                      uid: '1',
                      status: 'done',
                      url: image,
                    },
                  ]
                : []
            }
            onSuccess={(url: string) => {
              form.setFieldsValue({ imageUrl: url });
              setImage(url);
            }}
            onRemove={() => {
              setImage(undefined);
              form.setFieldsValue({ imageUrl: undefined });
            }}
          />
        </Form.Item>
      </Row>

      {/* <Form.Item name="birthDate" rules={rules.birthDate} label={L('birthDate')}>
        <Input type={'date'} style={{ width: '100%' }} />
      </Form.Item> */}

      {/* <Form.Item name="licenseUrl" label={L('license')}>
        <EditableImage
          defaultFileList={[]}
          onSuccess={(url: string) => form.setFieldsValue({ licenseUrl: url })}
          onRemove={() => form.setFieldsValue({ licenseUrl: undefined })}
        />
      </Form.Item> */}
    </>,
    <>
      <Form.Item
        name="bankId"
        initialValue={eventOrganizerData ? eventOrganizerData.bankId?.toString() : undefined}
        label={L('Bank')}
        rules={[rules.required]}
      >
        <Select placeholder={L('PleaseSelectABank')}>
          {banks &&
            banks?.length > 0 &&
            banks.map((bank: LiteEntityDto) => (
              <Select.Option key={bank.value} value={bank.value}>
                {bank.text}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="accountNumber"
        initialValue={eventOrganizerData ? eventOrganizerData.accountNumber?.toString() : undefined}
        label={L('BankAccountNumber')}
        rules={rules.accountNumber}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="companyWebsite"
        initialValue={
          eventOrganizerData ? eventOrganizerData.companyWebsite?.toString() : undefined
        }
        label={L('companyWebsite')}
      >
        <Input type="url" />
      </Form.Item>
    </>,
  ];

  return (
    <>
      <Modal
        width="95%"
        visible={visible}
        title={modalType === 'create' ? L('CreateEventOrganizer') : L('EditEventOrganizer')}
        onCancel={handleCancelModal}
        centered
        maskClosable={false}
        destroyOnClose
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={handleCancelModal}>
            {L('Cancel')}
          </Button>,
          <Button
            key="ddd"
            style={{
              margin: !localization.isRTL() ? '0 0 0 8px' : '0 8px 0 0',
              display: current === 0 ? 'none' : 'inline-block',
            }}
            type="default"
            onClick={() => {
              gotoStep(current - 1);
              document.querySelector('.scrollable-modal')!.scrollTop = 0;
            }}
          >
            {!localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
            <span>{L('Back')}</span>
          </Button>,
          <Button
            type="primary"
            key="dd"
            loading={isSubmittingEventOrganizer}
            onClick={() => {
              current !== 2 ? gotoStep(current + 1) : submit();
              document.querySelector('.scrollable-modal')!.scrollTop = 0;
            }}
          >
            <span>
              {current === 2 && modalType == 'create'
                ? L('Create')
                : current === 2 && modalType !== 'create'
                ? L('Save')
                : L('SaveAndContinue')}
            </span>
            {localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
          </Button>,
        ]}
      >
        <div className="scrollable-modal">
          {isGettingData ? (
            <div className="loading-comp">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <div className="custom-steps" style={{ display: current === 5 ? 'none' : 'grid' }}>
                <div className="steps-indicators">
                  {' '}
                  <Steps {...stepsProps} direction="vertical" className="steps-wrapper">
                    <Step
                      title={L('RegisterOrganizerStep1Title')}
                      description={L('RegisterOrganizerStep1Description')}
                    />
                    <Step
                      title={L('RegisterOrganizerStep2Title')}
                      description={L('RegisterOrganizerStep2Description')}
                    />
                    <Step
                      title={L('RegisterOrganizerStep3Title')}
                      description={L('RegisterOrganizerStep3Description')}
                    />
                  </Steps>
                </div>

                <div className={!localization.isRTL() ? 'steps-form rtl' : 'steps-form'}>
                  <Form {...layout} {...formProps}>
                    {formList[current]}
                  </Form>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default CreateOrUpdateEventOrganizer;
