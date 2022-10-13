/* eslint-disable */
import * as React from 'react';
import { Button, Form, Input, Steps, Result, Card, Select, Row, Col } from 'antd';
import { useStepsForm } from 'sunflower-antd';
import EventOrganizerService from '../../services/eventOrganizer';
import * as rules from './validations';
import LogoEn from '../../images/logo-en.svg';
import LogoAr from '../../images/logo-ar.svg';
import './index.less';
import { LiteEntityDto } from './../../services/dto/liteEntityDto';
import localization from '../../lib/localization';
import {
  LeftOutlined,
  LockOutlined,
  MailOutlined,
  RightOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { L } from '../../i18next';
import EditableImage from '../../components/EditableImage';
import indexesService from '../../services/indexes/indexesService';
import FormItem from 'antd/lib/form/FormItem';
import { CreateEventOrganizerDto } from '../../services/eventOrganizer/dto';
import { countriesCodes, countyCode } from '../../constants';
import { IndexType } from '../../lib/types';

const { Step } = Steps;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { span: 24 },
};
export default () => {
  const [banks, setBanks] = React.useState<LiteEntityDto[]>([]);
  const [image, setImage] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    async function getBanks(): Promise<void> {
      const result = await indexesService.getAllLite({
        maxResultCount: 100,
        skipCount: 0,
        type: IndexType.Bank,
      });
      setBanks(result.items);
    }
    getBanks();
  }, []);

  const {
    form,
    current = 0,
    gotoStep,
    stepsProps,
    formProps,
    submit,
    formLoading,
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

      const newValues: CreateEventOrganizerDto = {
        firstName: firstName?.toString(),
        lastname: lastname?.toString(),
        emailAddress: emailAddress?.toString(),
        password: password?.toString(),
        userName: userName?.toString(),
        countryCode: countryCode?.toString(),
        phoneNumber: phoneNumber?.toString(),
        //   licenseUrl: licenseUrl?.toString(),
        bankId: bankId?.toString(),
        accountNumber: accountNumber?.toString(),
        companyWebsite: companyWebsite?.toString(),
        imageUrl: imageUrl?.toString(),
        //  birthDate: new Date(birthDate?.toString()),
      };

      await EventOrganizerService.eventOrganizerRegister(newValues);

      return 'ok';
    },
    total: 4,
  });

  const formList = [
    <>
      <div className="login-wrap">
        <div className="login-inner">
          <div className="logo-wrap">
            <img className="website-logo" src={localization.isRTL() ? LogoAr : LogoEn} alt="logo" />
          </div>

          <Card className="login-card">
            <h3 style={{ textAlign: 'center' }}>{L('CreateAnAccount')}</h3>
            <p style={{ textAlign: 'center' }}>{L('RegisterEventsSubtext')}</p>
            <Row>
              <Col md={{ span: 11, offset: 0 }} xs={24}>
                <FormItem name="firstName" rules={rules.firstName}>
                  <Input
                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    size="large"
                    placeholder={L('FirstName')}
                    autoComplete="off"
                    defaultValue=""
                  />
                </FormItem>
              </Col>
              <Col md={{ span: 11, offset: 2 }} xs={24}>
                <FormItem name="lastname" rules={rules.lastName}>
                  <Input
                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    size="large"
                    autoComplete="off"
                    placeholder={L('lastName')}
                    defaultValue=""
                  />
                </FormItem>
              </Col>
            </Row>

            <FormItem name="emailAddress" rules={rules.email}>
              <Input
                placeholder={L('Email')}
                autoComplete="off"
                defaultValue=""
                prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                size="large"
              />
            </FormItem>

            <FormItem name="password" rules={rules.password}>
              <Input.Password
                visibilityToggle
                placeholder={L('Password')}
                defaultValue=""
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                size="large"
              />
            </FormItem>

            <Button type="primary" block onClick={() => gotoStep(1)}>
              <span>{L('CreateAccount')}</span>
              {localization.isRTL() ? (
                <LeftOutlined
                  style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
                />
              ) : (
                <RightOutlined
                  style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
                />
              )}
            </Button>

            <Button
              type="default"
              style={{ marginTop: '15px' }}
              block
              onClick={() => (window.location.href = '/user/event-organizer/login')}
            >
              {L('AlreadyHaveAccount')}
            </Button>
          </Card>
        </div>
      </div>
    </>,

    <>
      <Form.Item className="step-actions" {...tailLayout}>
        <div style={{ float: !localization.isRTL() ? 'right' : 'left' }}>
          <Button
            style={{ margin: !localization.isRTL() ? '0 10px 0 0' : '0 0 0 10px' }}
            type="default"
            onClick={() => {
              gotoStep(current - 1);
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
          </Button>
          <Button type="primary" onClick={() => gotoStep(current + 1)}>
            <span>{L('Next')}</span>
            {localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
          </Button>
        </div>
      </Form.Item>
      <Form.Item name="userName" rules={rules.userName} label={L('UserName')}>
        <Input />
      </Form.Item>
      <Row>
        <Col md={{ span: 6, offset: 0 }} xs={24}>
          <Form.Item initialValue={'+966'} name="countryCode" label={L('CountryCode')}>
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
            label={L('PhoneNumber')}
          >
            <Input />
          </Form.Item>
        </Col>
        <Form.Item name="imageUrl" label={L('Image')}>
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
      <Form.Item className="mobile-step-actions" {...tailLayout}>
        <div style={{ float: !localization.isRTL() ? 'right' : 'left' }}>
          <Button
            style={{ margin: !localization.isRTL() ? '0 10px 0 0' : '0 0 0 10px' }}
            type="default"
            onClick={() => {
              gotoStep(current - 1);
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
          </Button>
          <Button type="primary" onClick={() => gotoStep(current + 1)}>
            <span>{L('Next')}</span>
            {localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
          </Button>
        </div>
      </Form.Item>
    </>,
    <>
      <Form.Item className="step-actions" {...tailLayout}>
        <div style={{ float: !localization.isRTL() ? 'right' : 'left' }}>
          <Button
            type="default"
            onClick={() => {
              gotoStep(current - 1);
            }}
            style={{ margin: !localization.isRTL() ? '0 10px 0 0' : '0 0 0 10px' }}
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
          </Button>
          <Button
            type="primary"
            loading={formLoading}
            onClick={() => {
              submit().then((result) => {
                if (result === 'ok') {
                  gotoStep(current + 1);
                }
              });
            }}
          >
            <span>{L('CreateAccount')}</span>
            {localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
          </Button>
        </div>
      </Form.Item>

      <Form.Item name="bankId" label={L('Bank')} rules={[rules.required]}>
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

      <Form.Item name="accountNumber" label={L('BankAccountNumber')} rules={rules.accountNumber}>
        <Input />
      </Form.Item>

      <Form.Item name="companyWebsite" label={L('companyWebsite')}>
        <Input type="url" />
      </Form.Item>

      <Form.Item className="mobile-step-actions" {...tailLayout}>
        <div style={{ float: !localization.isRTL() ? 'right' : 'left' }}>
          <Button
            style={{ margin: !localization.isRTL() ? '0 10px 0 0' : '0 0 0 10px' }}
            type="default"
            onClick={() => {
              gotoStep(current - 1);
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
          </Button>
          <Button
            type="primary"
            loading={formLoading}
            onClick={() => {
              submit().then((result) => {
                if (result === 'ok') {
                  gotoStep(current + 1);
                }
              });
            }}
          >
            <span>{L('CreateAccount')}</span>
            {localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
          </Button>
        </div>
      </Form.Item>
    </>,
  ];
  return (
    <>
      <div
        className={current === 0 ? '' : 'custom-steps'}
        style={{ display: current === 3 ? 'none' : 'grid' }}
      >
        <div className="steps-indicators" style={{ display: current === 0 ? 'none' : 'block' }}>
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

        <div className={current === 0 ? '' : 'steps-form'}>
          <Form {...layout} {...formProps}>
            {formList[current]}
          </Form>
        </div>
      </div>
      {current === 3 && (
        <Result
          status="success"
          className="steps-result"
          title={L('AccountCreatedSuccessfully')}
          extra={
            <>
              <Button
                type="primary"
                onClick={() =>
                  setTimeout(() => (window.location.href = '/user/event-organizer/login'), 500)
                }
              >
                <span>{L('LogInNow')}</span>
                {localization.isRTL() ? (
                  <LeftOutlined
                    style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
                  />
                ) : (
                  <RightOutlined
                    style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
                  />
                )}
              </Button>
            </>
          }
        />
      )}
    </>
  );
};
